"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Modal,
  Drawer,
  ConfigProvider,
  notification,
} from "antd";
import Header from "@/app/components/header";
import NonShifaForm from "./Addformnonshifa";
import styles from "../shifa/tabestyle.module.css";
import { FaRegEye } from "react-icons/fa";
import { FaUserMd } from "react-icons/fa";
import { GiKidneys } from "react-icons/gi";
import { FaLungs } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { GiPelvisBone } from "react-icons/gi";
import { HiUpload } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import Tabs from "@/app/components/tabs/page";
import { ReloadOutlined } from "@ant-design/icons";

interface NonShifaPatient {
  key: string;
  userId?: string; // Added for secure filtering
  transplant: string;
  caseId: string;
  date: string;
  recipient: string;
  donor: string;
  relation: string;
}

export default function NonShifaPage() {
  type User = {
    id: string;
    email: string;
    password: string;
  };

  // ✅ All States
  const [patients, setPatients] = useState<NonShifaPatient[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("nonShifaPatients");
    const activeUserId = localStorage.getItem("activeUser");

    if (!saved || !activeUserId) return [];

    try {
      const parsed = JSON.parse(saved) as (NonShifaPatient & {
        userId?: string | null;
      })[];
      return parsed.filter((patient) => patient.userId === activeUserId);
    } catch (error) {
      console.error("failed to access non-shifa patients", error);
      return [];
    }
  });
  const [allDataFromStorage, setAllDataFromStorage] = useState<
    NonShifaPatient[]
  >(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("nonShifaPatients");
    if (!saved) return [];

    try {
      return JSON.parse(saved) as NonShifaPatient[];
    } catch (error) {
      console.error("failed to access non-shifa storage", error);
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<NonShifaPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<NonShifaPatient | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [uploads, setUploads] = useState<
    { id: string; documentType: string; file: File | null }[]
  >([{ id: crypto.randomUUID(), documentType: "", file: null }]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  // const Color_BG='linear-gradient(red,red,red)';

  // ✅ Load data from localstorage (Filtered by User)
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem("nonShifaPatients");
      const activeUserId = localStorage.getItem("activeUser");

      if (!activeUserId) {
        router.push("/login");
        return;
      }

      if (saved) {
        const allParsedData = JSON.parse(saved);
        setAllDataFromStorage(allParsedData); // Keep master list

        // Filter: Sirf current user ka data state mein daalein
        const filtered = allParsedData.filter(
          (p: NonShifaPatient & { userId: string | null }) =>
            p.userId === activeUserId,
        );
        setPatients(filtered);
      }
    };
    loadData();
  }, [router]);

  // ✅ User Authentication Check
  useEffect(() => {
    const checkUser = async () => {
      const activeUser = localStorage.getItem("activeUser");
      if (!activeUser) {
        router.push("/login");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUser = users.find((u: User) => u.id === activeUser);
      setUserData(currentUser);
    };
    checkUser();
  }, [router]);

  // --- Handlers ---
  const handleAddRow = () => {
    setUploads((prev) => [
      ...prev,
      { id: crypto.randomUUID(), documentType: "", file: null },
    ]);
  };

  const handleDocumentChange = (id: string, documentType: string) => {
    setUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, documentType } : item)),
    );
  };

  const handleFileChange = (id: string, file: File | null) => {
    setUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file } : item)),
    );
    setUploadedFile(file);
  };

  const handleRemoveRow = (id: string) => {
    setUploads((prev) => prev.filter((item) => item.id !== id));
  };

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

  const pageSize = 50;

  // ✅ Add new patient (Fixed with Global Storage Update)
  const handleSave = (formData: Omit<NonShifaPatient, "key">) => {
    const activeUserId = localStorage.getItem("activeUser");
    if (!activeUserId) {
      api.warning({ message: "Session expired, please login again" });
      return;
    }

    const newPatient: NonShifaPatient & { userId: string | null } = {
      key: crypto.randomUUID(),
      userId: activeUserId,
      ...formData,
    };

    // Global storage update (Master List)
    const allSaved = JSON.parse(
      localStorage.getItem("nonShifaPatients") || "[]",
    );
    const updatedMasterList = [...allSaved, newPatient];
    localStorage.setItem("nonShifaPatients", JSON.stringify(updatedMasterList));

    // UI update (Filtered list)
    setPatients((prev) => [...prev, newPatient]);
    setAllDataFromStorage(updatedMasterList);
    handleValidationsucess();
    setIsModalOpen(false);
  };
  const handleValidationError = () => {
    api.error({
      message: <span style={{ fontWeight: "bold" }}>Action Required</span>,
      description: "Please complete the form before submitting.",
      showProgress: true,
      duration: 3,
      placement: "topRight",
      style: {
        borderRadius: "4px",
      },
    });
  };
  const handleValidationsucess = () => {
    api.success({
      title: "",
      description: "Patient record added sucessfully!",
      showProgress: true,
      duration: 3,
      placement: "topRight",
      style: {
        borderRadius: "4px",
      },
    });
  };

  const handleUpload = (record: NonShifaPatient) => {
    setSelectedPatient(record);
    setIsUploadOpen(true);
  };

  const handleView = (record: NonShifaPatient) => {
    setViewData(record);
    setIsViewOpen(true);
  };

  // ✅ Delete patient (Fixed to update global storage)
  const handleDelete = (key: string) => {
    const allSaved: NonShifaPatient[] = JSON.parse(
      localStorage.getItem("nonShifaPatients") || "[]",
    );
    const updatedMasterList = allSaved.filter((p) => p.key !== key);
    localStorage.setItem("nonShifaPatients", JSON.stringify(updatedMasterList));

    setPatients((prev) => prev.filter((p) => p.key !== key));
    setAllDataFromStorage(updatedMasterList);
  };

  // ✅ Filter & Pagination
  const filteredData = patients.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // ✅ Table Columns
  const columns = [
    {
      title: "Sr #",
      render: (_: string, __: NonShifaPatient, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Transplant Type",
      dataIndex: "transplant",
      className: "text-[12px] font-normal text-gray-800",
      render: (value: unknown) => {
        const transplantValue = value as string;
        let icon = null;
        switch (transplantValue) {
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
            icon = <GiPelvisBone className="inline text-sky-600 " />;
            break;
          default:
            icon = null;
        }
        return (
          <div className="flex items-center gap-1">
            {icon}
            <span>{transplantValue}</span>
          </div>
        );
      },
    },
    {
      title: "HOTA Case ID",
      dataIndex: "caseId",
      className: "text-[12px] font-normal text-gray-800",
    },
    {
      title: "Date",
      dataIndex: "date",
      className: "text-[12px] font-normal text-gray-800",
    },
    {
      title: "Recipient Name",
      dataIndex: "recipient",
      className: "text-[12px] font-normal text-gray-800",
    },
    {
      title: "Donor Name",
      dataIndex: "donor",
      className: "text-[12px] font-normal text-gray-800",
    },
    {
      title: "Relation",
      dataIndex: "relation",
      className: "text-[12px] font-normal text-gray-800",
    },

    {
      title: "Document",
      align: "center" as const,
      render: (_: unknown, record: NonShifaPatient) => (
        <button
          onClick={() => handleUpload(record)}
          className="text-sky-600 hover:text-sky-700 underline"
          title="Upload Reports"
        >
          <HiUpload className="text-sky-600 hover:text-sky-700 text-lg" />
        </button>
      ),
    },
    {
      title: "Action",
      render: (_: string, record: NonShifaPatient) => (
        <div className=" flex  gap-2">
          <button
            onClick={() => handleView(record)}
            className="text-sky-600 hover:text-sky-700 text-lg ml-14 "
            title="view details"
          >
            <FaRegEye />
          </button>
          <button
            onClick={() => handleDelete(record.key)}
            className="text-red-700 text-lg"
          >
            <MdDeleteOutline />
          </button>
        </div>
      ),
    },
  ];

  const handimport = () => {
    if (viewData) {
      localStorage.setItem("importdata", JSON.stringify(viewData));
    }
    router.push("../../importdatanonshifa");
  };
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
      <div className=" min-h-screen bg-white pt-18 p-5">
        {contextHolder}
        <Header onAddClick={() => setIsModalOpen(true)} />
        <Tabs /> 

        <div className="p-4 bg-white shadow-md mt-1 ">
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-row gap-2">
              <h2 className="text-md font-semibold text-black uppercase">
                OTR Patients List (Non-Shifa)
              </h2>
              <ReloadOutlined
                className={styles.refreshIcon}
                onClick={handleRefreash}
              />
            </div>

            <input
              type="search"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm  text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 w-60"
            />
          </div>

          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            bordered
            className={`${styles.customTable} ${styles.tableScope}`}
            rowKey="key"
            locale={{ emptyText: "no patient record found" }}
          />

          <div className="flex justify-between bg-gray-50 p-2  items-center mt-4 rounded-sm">
            <p className="text-[12px] font-bold text-gray-600">
              Total Records:
              <span className="text-sky-700 font-md">
                {" "}
                {filteredData.length}
              </span>
            </p>
            <Pagination
              total={filteredData.length}
              pageSize={pageSize}
              current={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        </div>

        {/* ✅ Modal for Adding Form */}
        <Modal
          title={null}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={900}
          maskClosable={false}
          centered
          closable={false}
          className="relative overflow-hidden "
        >
          {/* ✅ Full-width Header */}
          <div className="absolute top-0 left-0 w-full bg-sky-700 text-white text-lg font-semibold px-4 py-2 z-10">
            ORT Registration Form (Non-Shifa)
          </div>

          {/* ✅ Inner content area (Form in center) */}
          <div className="mt-3 mb-7 px-6 py-4 bg-white">
            <NonShifaForm
              onSave={handleSave}
              onValidationFailed={handleValidationError}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>

          {/* ✅ Full-width Footer */}
          <div className="absolute bottom-0 left-0 w-full bg-gray-100 flex justify-center gap-3 p-4 ">
            <button
              type="submit"
              className="bg-sky-700 text-white px-3 py-1 rounded hover:bg-sky-800"
              form="nonshifa-form"
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </Modal>

        {/* ✅ Drawer for Viewing Details */}
        <Drawer
          title={null}
          open={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          footer={null}
          closable={false}
          mask={false}
          maskClosable={false}
          placement="right"
          className="custom-patient-drawer"
          size={450}
          styles={{
            body: {
              paddingBottom: 80,
              scrollbarWidth: "none", // Firefox ke liye
              msOverflowStyle: "none", // IE/Edge ke liye
            },
          }}
        >
          <div className="absolute w-full top-0 left-0 right-0 bg-sky-700 text-white text-md font-semibold p-4 flex justify-between items-center shadow-sm">
            <span>ORT Non-Shifa Patient Details</span>
            <button
              onClick={() => setIsViewOpen(false)}
              className="text-white hover:text-gray-200 text-xl"
              title="Close"
            >
              ✕
            </button>
          </div>
          {viewData && (
            <div className="p-4 bg-white min-h-full mt-10 space-y-1">
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
                  onClick={handimport}
                  className="p-1 text-white text-md bg-sky-600 hover:bg-sky-500 ml-75 px-2 rounded-sm mt-4"
                >
                  Import
                </button>
              </div>
            </div>
          )}
        </Drawer>

        {/* ✅ Document Upload Modal */}
        <Modal
          title={null}
          open={isUploadOpen}
          onCancel={() => {
            setIsUploadOpen(false);
            setUploadedFile(null);
          }}
          footer={null}
          width={800}
          centered
          closable={false}
          mask={true}
          maskClosable={true}
          rootClassName={styles.modalMaskTransparent}
        >
          {/* Blue Header Bar - Image Jaisa */}
          <div className="absolute top-0 left-0 w-full bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-t-sm shadow-sm flex justify-between items-center">
            <span>Upload OTR NON-Shifa Patients Documents</span>
          </div>

          <div className="mt-10 p-4 bg-white">
            {/* Table Header Row */}
            <div className="flex items-center gap-3 px-3 py-1 bg-gray-50 border border-[#bae7ff] mb-2">
              <span className="flex-1 text-[12px] font-bold text-sky-800 uppercase tracking-wider">
                Document Type
              </span>
              <span className="flex-1 text-[12px] font-bold text-sky-800 ml-5 uppercase tracking-wider">
                Upload Document
              </span>
              <button
                className="bg-sky-600 text-white px-4 py-1 rounded-sm hover:bg-sky-700 text-[11px] font-bold transition-colors"
                onClick={handleAddRow}
              >
                ADD
              </button>
            </div>

            {/* Dynamic Rows Section */}
            <div className="max-h-[300px] overflow-y-auto px-1 mb-5">
              {uploads.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 mb-2 bg-white p-2 border-b border-gray-100 last:border-0"
                >
                  {/* Document Type Select */}
                  <div className="flex-1">
                    <select
                      value={item.documentType}
                      onChange={(e) =>
                        handleDocumentChange(item.id, e.target.value)
                      }
                      className="  border border-gray-300 bg-white w-full p-1 text-[13px] text-sky-600 focus:ring-1 focus:ring-sky-500 outline-none rounded-sm"
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

                  {/* File Upload Box */}
                  <div className="flex-1 flex items-center gap-2">
                    <label className="flex items-center justify-between gap-2 cursor-pointer border border-gray-300 w-full p-1 px-2 text-[11px] bg-white hover:bg-gray-50 rounded-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <HiUpload className="text-sky-600 text-sm shrink-0" />
                        <span className="text-gray-500 truncate">
                          {item.file ? item.file.name : "Choose File"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
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

                  {/* Delete Action */}
                  <div className="w-8 flex justify-end">
                    {uploads.length > 1 && (
                      <button
                        className="text-red-400 hover:text-red-600 transition-colors"
                        onClick={() => handleRemoveRow(item.id)}
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons Bar */}
          <div className=" absolute bottom-0 w-full left-0 right-0 flex justify-center gap-3 p-3 bg-gray-50 border-t border-gray-200 rounded-b-sm">
            <button
              onClick={handleSaveDocuments}
              className="bg-green-600 text-white px-5 py-1 rounded-sm hover:bg-green-700 text-sm font-semibold transition-all shadow-sm"
            >
              SAVE
            </button>
            <button
              onClick={() => setIsUploadOpen(false)}
              className="bg-[#5da1d1] text-white px-5 py-1 rounded-sm hover:bg-sky-500 text-sm font-semibold transition-all shadow-sm"
            >
              BACK
            </button>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
