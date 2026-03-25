"use client";
import { useState, useEffect, useMemo } from "react";

import {
  Table,
  Pagination,
  Modal,
  Drawer,
  ConfigProvider,
  notification,
} from "antd";
import { ColumnsType } from "antd/es/table";

import Header from "@/app/components/header";

import ShifaForm from "./Addformshifa";
import type { ShifaFormData } from "./Addformshifa";

import "../shifa/tabestyle.css";

import { FaRegEye, FaUserMd, FaLungs, FaEye } from "react-icons/fa";

import { GiKidneys, GiPelvisBone } from "react-icons/gi";

import { MdDeleteOutline } from "react-icons/md";

import { HiUpload } from "react-icons/hi";

import { useRouter } from "next/navigation";

import Tabs from "@/app/components/tabs/page";
import { ReloadOutlined } from "@ant-design/icons";
import {
  useGetPatientsQuery,
  useAddPatientMutation,
  useDeletePatientMutation,
} from "@/app/store/services/shifaapi";

interface Patient {
  key: string;

  userId?: string;

  mrno: string;

  patientName: string;

  relation: string;

  patientType: string;

  transplant: string;

  surgeryLocation: string;

  surgeryDate: string;

  arrivalDate: string;

  arrivalLocation: string;
}

export default function ShifaPage() {
  const { data: patientsFromApi = [] } = useGetPatientsQuery();
  const [addPatient] = useAddPatientMutation();

  const [api, contextHolder] = notification.useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [viewData, setViewData] = useState<Patient | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [Open, setOpen] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [deletePatient] = useDeletePatientMutation();

  const [allPatients, setAllPatients] = useState<Patient[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("ShifaPatients");
    if (!saved) return [];

    try {
      return JSON.parse(saved) as Patient[];
    } catch (error) {
      console.error("failed to accsess the data", error);
      return [];
    }
  });

  const router = useRouter();
  const activeUserId = useMemo(
    () =>
      typeof window !== "undefined" ? localStorage.getItem("activeUser") : null,
    [],
  );

  // const Color_BG='linear-gradient(red,red,red)';
  // 📂 Document upload state

  const [uploads, setUploads] = useState<
    { id: string; documentType: string; file: File | null }[]
  >([{ id: crypto.randomUUID(), documentType: "", file: null }]);

  // 1. Initial Load & Auth Check - Hydration Fix

  useEffect(() => {
    const user = localStorage.getItem("activeUser");
    if (!user) {
      router.push("/login");
      return;
    }
  }, [router]);

  // 2. User-Specific Filtering + Search

  const filteredData = useMemo(() => {
    if (!activeUserId) return [];

    // Prefer API data (db.json/json-server). Fallback to localStorage if API is empty.
    const sourceData =
      Array.isArray(patientsFromApi) && patientsFromApi.length > 0
        ? (patientsFromApi as Patient[])
        : allPatients;

    const userSpecific = sourceData.filter((p) => p.userId === activeUserId);

    if (!searchTerm) return userSpecific;

    return userSpecific.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [allPatients, patientsFromApi, activeUserId, searchTerm]);

  const pageSize = 10;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // --- Handlers ---

  const handleSave = async (values: ShifaFormData) => {
    const currentUserId = localStorage.getItem("activeUser");

    if (!currentUserId) {
      api.warning({ message: "Session expired, please login again" });
      return;
    }

    const newPatient = {
      key: crypto.randomUUID(),
      userId: currentUserId,
      ...values,
    };

    const updatedTotal = [...allPatients, newPatient];
    await addPatient(newPatient).unwrap();
    localStorage.setItem("ShifaPatients", JSON.stringify(updatedTotal));
    setAllPatients(updatedTotal);
    handlevalidationSucess();
    setIsModalOpen(false);
  };

  const handlevalidationSucess = () => {
    api.success({
      title: "",
      description: "patient record added Successfully.",
      showProgress: true,
      duration: 5,
      placement: "topRight",
      style: {
        borderRadius: "4px",
      },
    });
  };
  const handleValidationError = () => {
    api.error({
      title: "",
      description: "Please complete the form before submitting.",
      showProgress: true,
      duration: 5,
      placement: "topRight",
      style: {
        borderRadius: "4px",
      },
    });
  };
  const handleDelete = async (id: string) => {
    try {
      await deletePatient(id).unwrap();
      api.success({ title: "patient record deleted sucessfully" });
    } catch (err) {
      api.error({ title: "failed delete" });
    }
  };

  const handleView = (record: Patient) => {
    setViewData(record);

    setOpen(true);
  };

  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  const handleAddRow = () =>
    setUploads([
      ...uploads,
      { id: crypto.randomUUID(), documentType: "", file: null },
    ]);

  const handleRemoveRow = (id: string) =>
    setUploads(uploads.filter((item) => item.id !== id));

  const handleDocumentChange = (id: string, value: string) =>
    setUploads(
      uploads.map((item) =>
        item.id === id ? { ...item, documentType: value } : item,
      ),
    );

  const handleFileChange = (id: string, file: File | null) =>
    setUploads(
      uploads.map((item) => (item.id === id ? { ...item, file } : item)),
    );

  const handleSaveDocuments = () => {
    // Check agar koi row khali hai

    if (uploads.some((u) => !u.documentType || !u.file)) {
      alert("Please select document type and upload file for all rows.");

      return;
    }

    // ✅ Console mein saari uploaded files show karne ke liye

    console.log("--- Uploaded Documents List ---");

    const documentsSummary = uploads.map((item, index) => ({
      Row: index + 1,

      Type: item.documentType,

      FileName: item.file?.name,

      FileSize:
        (item.file?.size ? item.file.size / 1024 : 0).toFixed(2) + " KB",
    }));

    console.table(documentsSummary); // table format mein behtar dikhta hai

    console.log("Full Uploads Data:", uploads);

    alert("Documents logged to console successfully!");

    setIsUploadOpen(false);
  };
  //for import data from drawer to page
  const handleimport = () => {
    if (viewData) {
      localStorage.setItem("tempimport", JSON.stringify(viewData));
    }
    router.push("../../importdata");
  };
  const columns: ColumnsType<Patient> = [
    {
      title: "Sr #",
      render: (_: unknown, __: Patient, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },

    {
      title: "Transplant Type",

      dataIndex: "transplant",

      className: "text-[12px] font-normal text-gray-800",

      render: (value: string) => {
        let icon = null;

        switch (value) {
          case "Liver Transplant":
            icon = <FaUserMd className="inline text-sky-600 mr-1" />;
            break;

          case "Kidney Transplant":
            icon = <GiKidneys className="inline text-sky-600 mr-1" />;
            break;

          case "Lung Transplant":
            icon = <FaLungs className="inline text-sky-600 mr-1" />;
            break;

          case "Cornea Transplant":
            icon = <FaEye className="inline text-sky-600 mr-1" />;
            break;

          case "Bon marrow Transplant":
            icon = <GiPelvisBone className="inline text-sky-600 mr-1" />;
            break;
        }

        return (
          <div className="flex items-center">
            {icon} <span>{value}</span>
          </div>
        );
      },
    },

    {
      title: "Patient MR No",
      dataIndex: "mrno",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Patient Name",
      dataIndex: "patientName",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Donor Relation",
      dataIndex: "relation",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Patient Type",
      dataIndex: "patientType",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Surgery Location",
      dataIndex: "surgeryLocation",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Surgery Date",
      dataIndex: "surgeryDate",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Arrival Date",
      dataIndex: "arrivalDate",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Arrival Location",
      dataIndex: "arrivalLocation",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Document",

      align: "center",

      render: () => (
        <button
          onClick={handleUpload}
          className="text-sky-600 hover:text-sky-700 underline"
        >
          <HiUpload className="text-sky-600 text-lg" />
        </button>
      ),
    },

    {
      title: "Action",

      align: "center",

      render: (_: unknown, record: Patient) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(record)}
            className="text-sky-600 hover:text-sky-700 text-lg ml-2"
            title="view details"
          >
            <FaRegEye />
          </button>

          <button
            onClick={() => handleDelete(record.id || record.key)}
            className="text-red-600  text-lg"
          >
            <MdDeleteOutline />
          </button>
        </div>
      ),
    },
  ];

  // Important: Prevents Layout Shift / Hydration error

  const handleRefreash = () => {
    window.location.reload();
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Notification: {
            // progressBg:Color_BG,
          },
        },
      }}
    >
      <div className="min-h-screen bg-gray-50 p-5 pt-18">
        {contextHolder}
        <Header onAddClick={() => setIsModalOpen(true)} />

        <Tabs />

        <div className="p-4 bg-white shadow-md mt-1 rounded-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-row gap-2">
              <h2 className="text-md font-bold text-black uppercase tracking-tight">
                ORT Patients List (Shifa)
              </h2>

              <ReloadOutlined
                className="shifa-refresh-icon "
                onClick={handleRefreash}
              />
            </div>
            <input
              type="search"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300  text-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400 w-60"
            />
          </div>

          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            bordered
            rowKey="key"
            className="custom-table"
            scroll={{ x: true }}
            locale={{ emptyText: "No patient records found" }}
          />

          <div className="flex justify-between items-center mt-4 bg-gray-50 p-2 rounded-sm">
            <p className="text-[12px] font-semibold text-gray-600">
              Total Records:{" "}
              <span className="text-sky-700 font-bold">
                {filteredData.length}
              </span>
            </p>

            <Pagination
              total={filteredData.length}
              pageSize={pageSize}
              current={currentPage}
              onChange={setCurrentPage}
              size="small"
            />
          </div>
        </div>

        {/* ✅ Document Upload Modal - Clean Layout */}

        <Modal
          title={null}
          open={isUploadOpen}
          onCancel={() => setIsUploadOpen(false)}
          footer={null}
          width={800}
          centered
          closable={false}
          className="upload-modal"
          maskClosable={false}
        >
          <div className="absolute top-0 left-0 w-full bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-t-sm">
            Upload OTR Shifa Patients Documents
          </div>

          <div className="mt-10 p-4">
            <div className="flex items-center gap-3 px-3 py-1 bg-gray-50 border border-gray-200 mb-2">
              <span className="flex-1 text-[12px] font-bold text-sky-800  uppercase">
                Document Type
              </span>

              <span className="flex-1 text-[12px] font-bold text-sky-800  ml-5 uppercase">
                Upload Document
              </span>

              <button
                className="bg-sky-600 text-white px-4 py-1 rounded-sm hover:bg-sky-700 text-[11px] font-bold"
                onClick={handleAddRow}
              >
                ADD
              </button>
            </div>

            <div className="max-h-75 overflow-y-auto mr-10 mb-10">
              {uploads.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 mb-2 p-1 border-b border-gray-50"
                >
                  <div className="flex-1">
                    <select
                      value={item.documentType}
                      onChange={(e) =>
                        handleDocumentChange(item.id, e.target.value)
                      }
                      className="border border-gray-300 w-full p-1 text-[12px] text-sky-700 bg-white outline-none rounded-sm"
                    >
                      <option value="" disabled hidden>
                        Select Document Type
                      </option>

                      {[
                        "Affidavit",
                        "Biometric Donor Verification",
                        "Biometric Recipient Verification",
                        "Committee Member Evaluation/Approval",
                        "FRC",
                        "HOTA Approval",
                        "Other",
                      ].map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="flex items-center justify-between border border-gray-300 p-1 px-2 text-[11px] cursor-pointer bg-white rounded-sm hover:bg-gray-50">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <HiUpload className="text-sky-600 text-sm" />

                        <span className="text-gray-500 truncate">
                          {item.file ? item.file.name : "Choose File"}
                        </span>
                      </div>

                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(
                            item.id,
                            e.target.files ? e.target.files[0] : null,
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploads.length > 1 && (
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveRow(item.id)}
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full flex justify-center gap-3 p-3 bg-gray-100 rounded-b-sm">
            <button
              onClick={handleSaveDocuments}
              className="bg-green-600 text-white px-5 py-1 rounded-sm hover:bg-green-700 text-xs font-bold shadow-sm"
            >
              SAVE
            </button>

            <button
              onClick={() => setIsUploadOpen(false)}
              className="bg-[#5da1d1] text-white px-5 py-1 rounded-sm hover:bg-sky-500 text-xs font-bold shadow-sm"
            >
              BACK
            </button>
          </div>
        </Modal>

        {/* ✅ Add Form Modal */}

        <Modal
          title={null}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={900}
          maskClosable={false}
          closable={false}
          centered
          rootClassName="no-mask-modal"
        >
          <div className="absolute top-0 left-0 w-full bg-sky-700 text-white text-md font-semibold px-5 py-3">
            ORT Registration Form (Shifa)
          </div>

          <div className="bg-white mt-10 mb-10">
            <ShifaForm
              onSave={handleSave}
              onValidationFailed={handleValidationError}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full flex justify-center gap-3 p-5 bg-gray-100 rounded-b-sm">
            <button
              type="submit"
              form="shifa-form"
              className="bg-sky-700 text-white px-4 py-2 rounded-sm hover:bg-sky-800 text-xs font-bold"
            >
              SAVE
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-green-600 text-white px-3 py-2 rounded-sm hover:bg-gray-600 text-xs font-bold"
            >
              CANCEL
            </button>
          </div>
        </Modal>

        {/* ✅ View Drawer */}

        <Drawer
          title={null}
          open={Open}
          onClose={() => setOpen(false)}
          maskClosable={false}
          footer={null}
          closable={false}
          size={500} // Size prop ki jagah width standard hai
          placement="right"
          styles={{
            body: {
              padding: 0,
              paddingBottom: 80,
              scrollbarWidth: "none", // Firefox ke liye
              msOverflowStyle: "none",
            },
          }}
          // Padding zero taake header aur content sahi bethein
        >
          {/* Header Section */}

          <div className="bg-sky-700 text-white text-md font-semibold p-4 flex justify-between items-center shadow-sm">
            <span>ORT Shifa Patient Details</span>

            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl hover:opacity-80 transition-opacity"
            >
              ✕
            </button>
          </div>

          {/* Content Section */}

          {viewData && (
            <div className="p-4 bg-white min-h-full space-y-1">
              {Object.entries(viewData).map(
                ([key, value]) =>
                  key !== "key" &&
                  key !== "userId" && (
                    <div
                      key={key}
                      className="bg-gray-70 border-b border-gray-100 p-3 flex justify-between items-center first:rounded-t-md last:rounded-b-md last:border-none"
                    >
                      {/* Label - Left Side */}

                      <p className="text-[13px] font-bold text-sky-800 uppercase tracking-tight w-1/2">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </p>

                      {/* Value - Right Side (Aligned in a straight line) */}

                      <p className="text-[13px] text-blue-900 font-normal w-1/2 text-left border-l border-gray-100 pl-4">
                        {(value as string) || "N/A"}
                      </p>
                    </div>
                  ),
              )}
              <div>
                <button
                  onClick={handleimport}
                  className="p-1 text-white text-md bg-sky-600 hover:bg-sky-500 ml-100 rounded-sm py-1 px-2 mt-4"
                >
                  Import
                </button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
