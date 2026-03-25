"use client";
import { useState, forwardRef, useImperativeHandle } from "react";
import { DatePicker, Form, Input } from "antd";
import { FaUserMd, FaLungs, FaEye, FaSearch } from "react-icons/fa";
import { GiKidneys, GiPelvisBone } from "react-icons/gi";
import dayjs from "dayjs"; // ✅ Dayjs import karna zaroori hai
import type { Dayjs } from "dayjs";

export interface NonShifaFormData {
  transplant: string;
  caseId: string;
  date: string;
  recipient: string;
  donor: string;
  relation: string;
}

export interface NonShifaFormRef {
  fillData: (data: Partial<NonShifaFormData>) => void;
}

interface Props {
  onSave: (data: NonShifaFormData) => void;
   onValidationFailed?: () => void;
  onCancel: () => void;
}

// passing Props  and  ref type 
type NonShifaFormValues = Omit<NonShifaFormData, "date"> & {
  date?: Dayjs;
};

const Addformnonshifa = forwardRef<NonShifaFormRef, Props>((props, ref) => {
  const { onSave,onValidationFailed } = props; // ✅ onSave ko props se nikala
  const [form] = Form.useForm();
  const [isHovered, setIsHovered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
 

  const transplantOptions = [
    { label: "Liver Transplant", value: "Liver", icon: <FaUserMd className="text-sky-600" /> },
    { label: "Kidney Transplant", value: "Kidney", icon: <GiKidneys className="text-sky-600" /> },
    { label: "Lung Transplant", value: "Lung", icon: <FaLungs className="text-sky-600" /> },
    { label: "Cornea Transplant", value: "Cornea", icon: <FaEye className="text-sky-600" /> },
    { label: "Bone Marrow Transplant", value: "Bone", icon: <GiPelvisBone className="text-sky-600" /> },
  ];

  // ✅ Imperative Handle logic
  useImperativeHandle(ref, () => ({
    fillData: (data: Partial<NonShifaFormData>) => {
      const formattedData = {
        ...data,
        // Non-shifa mein field ka naam sirf 'date' hai
        date: data.date ? dayjs(data.date) : null,
      };
      form.setFieldsValue(formattedData);
      
      if (data.transplant) {
        const found = transplantOptions.find(opt => opt.label === data.transplant);
        if (found) setSelected(found.value);
      }
    },
  }));

  const onFinish = (values: NonShifaFormValues) => {
    const finalData = {
      ...values,
      date: values.date ? values.date.format("DD-MMM-YYYY") : "", 
    };
    onSave(finalData);
  };

  const labelStyle = "text-[11px] font-bold text-sky-800 uppercase";

  return (
    <div className="mt-5">
      <Form
        form={form}
        id="nonshifa-form"
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={()=>onValidationFailed?.()}
        
        labelAlign="left" 
        labelCol={{ span: 10 }} 
        wrapperCol={{ span: 14 }} 
        className="p-2 bg-white "
        requiredMark={(label, { required }) => (
          <div className="flex items-center">
            {label} 
            {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
          </div>
        )}
      >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
          
          <Form.Item label={<span className={labelStyle}>Transplant Type</span>} required>
            <div className="relative">
              <Form.Item name="transplant" noStyle rules={[{ required: true, message: '' }]}>
                <div
                  className="flex items-center justify-between border border-gray-300 rounded-sm px-2 bg-white cursor-pointer h-7 transition-all"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="flex items-center gap-1 overflow-hidden">
                    {selected ? (
                      <>
                        {transplantOptions.find((opt) => opt.value === selected)?.icon}
                        <span className="text-[11px] truncate">{transplantOptions.find((opt) => opt.value === selected)?.label}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Select type...</span>
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

          <Form.Item name="caseId" label={<span className={labelStyle}>HOTA Case ID </span>} rules={[{ required: true, message: '' }]}>
            <Input suffix={<FaSearch className="text-gray-400 text-xs" />} className="h-7 text-xs rounded-sm" />
          </Form.Item>

          <Form.Item name="date" label={<span className={labelStyle}>Approval Date </span>} rules={[{ required: true, message: '' }]}>
            <DatePicker format="DD-MMM-YYYY" className="w-full h-7 text-xs rounded-sm" />
          </Form.Item>

          <Form.Item name="recipient" label={<span className={labelStyle}>Patient Name </span>} rules={[{ required: true, message: '' }]}>
            <Input placeholder="Recipient Name" className="h-7 text-xs rounded-sm" />
          </Form.Item>

          <Form.Item name="donor" label={<span className={labelStyle}>Donor Name </span>} rules={[{ required: true, message: '' }]}>
            <Input placeholder="Donor Name" className="h-7 text-xs rounded-sm" />
          </Form.Item>

          <Form.Item name="relation" label={<span className={labelStyle}>Donor Relation </span>} rules={[{ required: true, message: "" }]}>
            <Input className="h-7 text-xs rounded-sm" />
          </Form.Item>
          
        </div>
      </Form>
    </div>
  );
});

// ✅ DisplayName add kiya taake ESLint error na de
Addformnonshifa.displayName = "Addformnonshifa";

export default Addformnonshifa;
