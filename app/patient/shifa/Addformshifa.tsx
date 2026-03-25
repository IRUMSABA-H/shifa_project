"use client";
import { useState, forwardRef, useImperativeHandle } from "react";
import { DatePicker, Form, Input, Radio } from "antd";
import { FaUserMd, FaLungs, FaEye, FaSearch } from "react-icons/fa";
import { GiKidneys, GiPelvisBone } from "react-icons/gi";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export interface ShifaFormData {
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

export interface ShifaFormRef {
  fillData: (data: Partial<ShifaFormData>) => void;
}

interface Props {
  onSave: (data: ShifaFormData) => void;
  onValidationFailed?: () => void;
  onCancel: () => void;
}

//  forwardRef ko proper name dena zaroori hai error hatane ke liye
type ShifaFormValues = Omit<ShifaFormData, "surgeryDate" | "arrivalDate"> & {
  surgeryDate?: Dayjs;
  arrivalDate?: Dayjs;
};

const ShifaForm = forwardRef<ShifaFormRef, Props>((props, ref) => {
  const { onSave, onValidationFailed } = props;
  const [form] = Form.useForm();
  const [isHovered, setIsHovered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const transplantOptions = [
    {
      label: "Liver Transplant",
      value: "Liver",
      icon: <FaUserMd className="text-sky-600" />,
    },
    {
      label: "Kidney Transplant",
      value: "Kidney",
      icon: <GiKidneys className="text-sky-600" />,
    },
    {
      label: "Lung Transplant",
      value: "Lung",
      icon: <FaLungs className="text-sky-600" />,
    },
    {
      label: "Cornea Transplant",
      value: "Cornea",
      icon: <FaEye className="text-sky-600" />,
    },
    {
      label: "Bone Marrow Transplant",
      value: "Bone",
      icon: <GiPelvisBone className="text-sky-600" />,
    },
  ];

  //  Imperative handle
  useImperativeHandle(ref, () => ({
    fillData: (data: Partial<ShifaFormData>) => {
      const formattedData = {
        ...data,
        surgeryDate: data.surgeryDate ? dayjs(data.surgeryDate) : null,
        arrivalDate: data.arrivalDate ? dayjs(data.arrivalDate) : null,
      };
      form.setFieldsValue(formattedData);

      if (data.transplant) {
        const found = transplantOptions.find(
          (opt) => opt.label === data.transplant,
        );
        if (found) setSelected(found.value);
      }
    },
  }));

  const onFinish = (values: ShifaFormValues) => {
    const finalData = {
      ...values,
      surgeryDate: values.surgeryDate
        ? values.surgeryDate.format("DD-MMM-YYYY")
        : "",
      arrivalDate: values.arrivalDate
        ? values.arrivalDate.format("DD-MMM-YYYY")
        : "",
    };
    onSave(finalData);
  };

  const labelStyle = "text-[11px] font-bold text-sky-800 uppercase";

  return (
    <div className="mt-5">
      <Form
        form={form}
        id="shifa-form"
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={() => onValidationFailed?.()}
        labelAlign="left"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        className="p-4 bg-white"
        requiredMark={(label, { required }) => (
          <div className="flex items-center">
            {label}
            {required && (
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            )}
          </div>
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
          <Form.Item
            name="mrno"
            label={<span className={labelStyle}>Patient MrNo </span>}
            rules={[{ required: true, message: "" }]}
          >
            <Input
              suffix={<FaSearch className="text-gray-400 text-xs" />}
              className="h-7 text-xs rounded-sm"
            />
          </Form.Item>

          <Form.Item
            name="patientName"
            label={<span className={labelStyle}>Patient Name </span>}
            rules={[{ required: true, message: "" }]}
          >
            <Input
              placeholder="Recipient Name"
              className="h-7 text-xs rounded-sm"
            />
          </Form.Item>

          <Form.Item
            name="relation"
            label={<span className={labelStyle}>Donor Relation </span>}
            rules={[{ required: true, message: "" }]}
          >
            <div className="flex gap-1">
              <Input className="h-7 text-xs w-full rounded-sm" />
              <Input
                placeholder="Other"
                className="h-7 text-xs w-full bg-gray-50 rounded-sm"
                disabled
              />
            </div>
          </Form.Item>

          <Form.Item
            name="patientType"
            label={<span className={labelStyle}>Patient Type</span>}
            rules={[{ required: true, message: "" }]}
          >
            <Radio.Group className="flex gap-4 scale-75 origin-left">
              <Radio value="Donor">Donor</Radio>
              <Radio value="Recipient">Recipient</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className={labelStyle}>Transplant Type </span>}
            required
          >
            <div className="relative">
              <Form.Item
                name="transplant"
                noStyle
                rules={[{ required: true, message: "" }]}
              >
                <div
                  className="flex items-center justify-between border border-gray-300 rounded-sm px-2 bg-white cursor-pointer h-7 transition-all"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {selected ? (
                      <>
                        {
                          transplantOptions.find(
                            (opt) => opt.value === selected,
                          )?.icon
                        }
                        <span className="text-[11px] truncate">
                          {
                            transplantOptions.find(
                              (opt) => opt.value === selected,
                            )?.label
                          }
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-[11px]">
                        Select type...
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">▼</span>
                </div>
              </Form.Item>
              {isHovered && (
                <div
                  className="absolute bg-white border border-gray-300 shadow-xl w-full z-50 rounded-sm mt-0.5"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {transplantOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 p-2 hover:bg-sky-50 cursor-pointer text-[11px]"
                      onClick={() => {
                        setSelected(option.value);
                        form.setFieldsValue({ transplant: option.label });
                        setIsHovered(false);
                      }}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="surgeryLocation"
            label={<span className={labelStyle}>Surgery Location </span>}
            rules={[{ required: true, message: "" }]}
          >
            <Input className="h-7 text-xs rounded-sm" />
          </Form.Item>

          <Form.Item
            name="surgeryDate"
            label={<span className={labelStyle}>Surgery Date </span>}
            rules={[{ required: true, message: "" }]}
          >
            <DatePicker
              format="DD-MMM-YYYY"
              className="w-full h-7 text-xs rounded-sm"
            />
          </Form.Item>

          <Form.Item
            name="arrivalLocation"
            label={<span className={labelStyle}>Arrival Location </span>}
            rules={[{ required: true, message: "" }]}
          >
            <Radio.Group className="flex gap-4 scale-75 origin-left">
              <Radio value="ER">ER</Radio>
              <Radio value="OPD">OPD</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="arrivalDate"
            label={<span className={labelStyle}>Arrival Date </span>}
            rules={[{ required: true, message: "" }]}
          >
            <DatePicker
              format="DD-MMM-YYYY"
              className="w-full h-7 text-xs rounded-sm"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
});

// Display name is important when  forwardRef is use
ShifaForm.displayName = "ShifaForm";

export default ShifaForm;
