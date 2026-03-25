"use client";
import React from 'react';
import { Checkbox, Form, Input, Select,  } from 'antd';
import type { FormInstance } from 'antd';

type FormMode = 'add-parent' | 'add-child' | 'edit';

interface AddFormProps {
  form: FormInstance;
  parentOptions: { label: string; value: string }[];
  mode: FormMode;
  lockedParentLabel?: string;
  lockedParentId?: string;
}

export const AddForm = ({ form, parentOptions, mode, lockedParentLabel, lockedParentId }: AddFormProps) => {
  const labelStyle = 'text-[11px] font-bold text-sky-800 uppercase rounded-none';
  const isAddChild = mode === 'add-child';
  const showParentField = isAddChild;
  
  return (
    <Form
      form={form}
      id="permission-form"
      layout="horizontal"
      labelAlign="left"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      requiredMark={(label, { required }) => (
        <span className={labelStyle}>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
        <Form.Item name="name" label={<span className={labelStyle}>Permission Name </span>} rules={[{ required: true ,message:'' }]}>
          <Input className="h-7 text-xs" />
        </Form.Item>

        <Form.Item name="code" label={<span className={labelStyle}>Permission Code</span>} rules={[{ required: true,message:''  }]}>
          <Input className="h-7 text-xs" />
        </Form.Item>

        <Form.Item name="department" label={<span className={labelStyle}>Department </span>}  rules={[{ required: true,message:''  }]}>
          <Select
            className="h-7 text-xs"
            disabled={mode==='add-child'}
            options={[
              { label: 'OR', value: 'Or' },
              { label: 'IT', value: 'IT' },
              { label: 'Opd', value: 'opd' },
              { label: 'Emergency', value: 'emergency' },
            ]}
          />
        </Form.Item>
{mode==='add-child'&&(
        <Form.Item name="isChild" label="Is Child" valuePropName="checked">
          <Checkbox  disabled />
        </Form.Item>
)}

        {showParentField && (
          <Form.Item name="parentId" label="Select Parent">
            <Select
              placeholder="Select Parent"
              className="h-7 text-xs"
              options={
                lockedParentId && lockedParentLabel
                  ? [{ label: lockedParentLabel, value: lockedParentId }]
                  : parentOptions
              }
              disabled
            />
          </Form.Item>
        )}

        <Form.Item name="description" label="Description">
          <Input className="h-7 text-xs" />
        </Form.Item>
      </div>
    </Form>
  );
};
