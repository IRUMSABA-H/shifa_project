"use client";
import { Key, useState } from 'react';
import Header from '../components/header';
import Tabs from '../components/tabs/page';
import { Form, Input, Modal, Space, Switch, Table, Tooltip ,ConfigProvider, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { AddForm } from './addform';
import { IoAdd } from "react-icons/io5";

import {
  CloseCircleFilled,
  DownOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import './permissionlist.css';

// const COLOR_BG = 'linear-gradient(red,red, red)';

interface DataType {
  key: string;
  name: string;
  code: string;
  department: string;
  description: string;
  status: boolean;
  canExpand?: boolean;
  parentDepartment?: string;
  children?: DataType[];
}

type ModalMode = 'add-parent' | 'add-child' | 'edit';
type SearchableColumn = 'name' | 'code' | 'department' | 'description';

const PermissionList = () => {
  const [form] = Form.useForm();
  const [api,contextHolder]=notification.useNotification();
  const [modalopen, setismodalopen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>('add-parent');
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  const [columnFilters, setColumnFilters] = useState<Record<SearchableColumn, string>>({
    name: '',
    code: '',
    department: '',
    description: '',
  });
//dummy datasorce at first
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '1',
      name: 'IP Reservation',
      code: 'cbd_ip_res',
      department: 'Corporate Business Development',
      description: 'reservation for in patient',
      status: false,
      canExpand: true,
      children: [
        {
          key: '1-1',
          name: 'Er Pre Auth',
          code: 'Er_Pre_Auth',
          department: 'Corporate Business Development',
          parentDepartment: 'Corporate Business Development',
          description: 'reservations for Er Pre Auth',
          status: true,
        },
        {
          key: '1-2',
          name: 'Arrivals',
          code: 'Arrivals',
          department: 'Corporate Business Development',
          parentDepartment: 'Corporate Business Development',
          description: 'Arrivals for patients',
          status: true,
          canExpand: true,
          children: [
            {
              key: '1-2-1',
              name: 'Arrivals',
              code: 'add',
              department: 'Corporate Business Development',
              parentDepartment: 'Corporate Business Development',
              description: 'Add Arrivals for patients',
              status: true,
            },
            {
              key: '1-2-2',
              name: 'Census',
              code: 'census',
              department: 'Corporate Business Development',
              parentDepartment: 'Corporate Business Development',
              description: 'Census for patients (edited)',
              status: true,
            },
          ],
        },
      ],
    },
    {
      key: '2',
      name: 'IP Reservation 2',
      code: 'khjg56',
      department: 'Corporate Business Development',
      description: 'dfsdfsdf',
      status: true,
    },
  ]);

  const isExpandableRow = (record: DataType) => Boolean(record.canExpand || (record.children && record.children.length));

  const updateStatus = (list: DataType[], key: string, value: boolean): DataType[] => {
    return list.map((item) => {
      if (item.key === key) return { ...item, status: value };
      if (item.children) return { ...item, children: updateStatus(item.children, key, value) };
      return item;
    });
  };

  const findNodeByKey = (list: DataType[], key: string): DataType | undefined => {
    for (const item of list) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findNodeByKey(item.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };
 //add child to parent 
  const addChildToParent = (list: DataType[], parentId: string, newItem: DataType): DataType[] => {
    return list.map((item) => {
      if (item.key === parentId) {
        return {
          ...item,
          canExpand: true,
          children: [...(item.children || []), newItem],
        };
      }
      if (item.children) return { ...item, children: addChildToParent(item.children, parentId, newItem) };
      return item;
    });
  };
//dummy data for children
  const addDummyChildren = (list: DataType[], targetKey: string): DataType[] => {
    return list.map((item) => {
      if (item.key === targetKey && (!item.children || item.children.length === 0)) {
        return {
          ...item,
          children: [
            {
              key: `${item.key}-d1`,
              name: 'Dummy child 1',
              code: `${item.code}_d1`,
              department: item.department,
              parentDepartment: item.department,
              description: 'auto generated child',
              status: true,
            },
            {
              key: `${item.key}-d2`,
              name: 'Dummy child 2',
              code: `${item.code}_d2`,
              department: item.department,
              parentDepartment: item.department,
              description: 'auto generated child',
              status: false,
            },
          ],
        };
      }
      if (item.children) return { ...item, children: addDummyChildren(item.children, targetKey) };
      return item;
    });
  };

  const updateNodeByKey = (list: DataType[], key: string, updater: (item: DataType) => DataType): DataType[] => {
    return list.map((item) => {
      if (item.key === key) return updater(item);
      if (item.children) return { ...item, children: updateNodeByKey(item.children, key, updater) };
      return item;
    });
  };
//for the parent form funtion onclick this will open
  const openAddParentModal = () => {
    setModalMode('add-parent');
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({ isChild: undefined, parentId: undefined });
    setismodalopen(true);
  };
//for the child modal onclick this is gonna be open 
  const openAddChildModal = (record: DataType) => {
    setModalMode('add-child');
    setSelectedRecord(record);
    form.resetFields();
    form.setFieldsValue({
      
      isChild: true,
      parentId: record.key,//parent id is gonna be the parent bcz it is child, and deparment as well
      department: record.department,
    });
    setismodalopen(true);
  };
// edit modal can edit the form
  const openEditModal = (record: DataType) => {
    setModalMode('edit');
    setSelectedRecord(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      department: record.department,
      description: record.description,
      isChild: Boolean(record.parentDepartment),
    });
    setismodalopen(true);
  };
// onclose moda will close
  const closeModal = () => {
    setismodalopen(false);
    setSelectedRecord(null);
    form.resetFields();
  };

//for record if match the column
  const recordMatchesColumn = (record: DataType, columnKey: SearchableColumn, query: string): boolean => {
    const normalizedQuery = query.toLowerCase().trim();
    const currentValue = (record[columnKey] || '').toString().toLowerCase();
    if (currentValue.includes(normalizedQuery)) return true;
    return Boolean(record.children?.some((child) => recordMatchesColumn(child, columnKey, query)));
  };

  const getColumnSearchProps = (columnKey: SearchableColumn, placeholder: string) => ({
    filteredValue: columnFilters[columnKey] ? [columnFilters[columnKey]] : null,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => {
      const value = (selectedKeys?.[0] as string) || '';
     //agr jo search kiya hai ,to wo show kara do
      const onSearch = () => {
        setColumnFilters((prev) => ({ ...prev, [columnKey]: value.trim() }));
        confirm();
      };

      //reset function ,reset the filter 

      const onReset = () => {
        setSelectedKeys([]);
        clearFilters?.();
        setColumnFilters((prev) => ({ ...prev, [columnKey]: '' }));
        confirm();
      };
      
      return (

        //permission filter kay dropdown kay liya  
        <div className="permission-filter-dropdown" onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={onSearch}  //can search the column data  as well if the ener is pressed 
            className="permission-filter-input"
          />
          <div className="permission-filter-actions">
            <button type="button" className="permission-filter-btn permission-filter-btn-primary" onClick={onSearch}>
              Search
            </button>
            {/* reset the column again, in both cases data found or not */}
            <button type="button" className="permission-filter-btn permission-filter-btn-outline" onClick={onReset}>
              Reset
            </button>
          </div>
        </div>
      );
    },
    filterIcon: (filtered: boolean) =>
      filtered ? <CloseCircleFilled className="permission-col-filter-active" /> : <SearchOutlined className="permission-col-filter" />,
    filterDropdownProps: {
      placement: 'bottomRight' as const,//for the placement of the serach under the cloumn
    },
    onFilter: (value: Key | boolean, record: DataType) => recordMatchesColumn(record, columnKey, String(value)),
  });


  // columns kay header or rows kay liya antd design kay
  const columns: ColumnsType<DataType> = [
    {
      title: 'Permission Name',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      ...getColumnSearchProps('name', 'Search name'),
      render: (_, record) => {
        const expandable = isExpandableRow(record);
        return (
          <span className={`permission-name-cell ${expandable ? 'folder-row' : ''}`}>
            {expandable ? <FolderOutlined className="permission-folder-icon" /> : <FileOutlined className="permission-file-icon" />}
            {record.name}
          </span>
        );
      },
    },

    { title: 'Permission Code', dataIndex: 'code', key: 'code', width: 180, ...getColumnSearchProps('code', 'Search code') },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 260,
      ...getColumnSearchProps('department', 'Search department'),
      onCell: (record) => ({
        rowSpan: departmentRowSpanByKey[record.key] ?? 1,
      }),
      render: (_, record) => record.department,
    },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 300, ...getColumnSearchProps('description', 'Search description') },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Switch
          checked={record.status}
          size="small"
          onChange={(checked) => setDataSource((prev) => updateStatus(prev, record.key, checked))}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={20}>
            <Tooltip title="add child"><IoAdd className="text-black cursor-pointer"  onClick={() => openAddChildModal(record)}/></Tooltip> {/*openchild modal+ child add kar raha hai parent kay */}
           <Tooltip title="Edit"><EditOutlined className="text-sky-700 cursor-pointer" onClick={() => openEditModal(record)} /></Tooltip> {/* edit kar raha hai modal */}
         
        </Space>
      ),
    },
  ];

//  handle save pay data save ho raha hai tabale main according the mode selected
const handleSave = () => {
    form.validateFields()
      .then((values) => {
        // --- SUCCESS LOGIC ---
        if (modalMode === 'edit' && selectedRecord) {
          setDataSource((prev) =>
            updateNodeByKey(prev, selectedRecord.key, (item) => ({
              ...item,
              ...values,
            }))
          );
        } else {
          const parentId = modalMode === 'add-child' ? selectedRecord?.key : values.parentId;
          const parentNode = parentId ? findNodeByKey(dataSource, parentId) : undefined;

          const newItem: DataType = {
            key: Math.random().toString(36).slice(2, 11),
            ...values,
            parentDepartment: parentNode?.department,
            status: true,
            canExpand: false,
          };

          if (modalMode === 'add-parent') setDataSource((prev) => [...prev, newItem]);
          else if (parentId) setDataSource((prev) => addChildToParent(prev, parentId, newItem));
        }

      api.success({
        title: '',
          description: ' permision has been saved sucessfully.',
          showProgress: true, // Progress bar enable
          duration: 3,
          placement: 'topRight',
          style: {
            borderRadius: '4px',
          }

      })

        closeModal();
      })
      .catch(() => {
        // --- GRADIENT NOTIFICATION LOGIC ---
        api.error({
          title: '',
          description: ' Please complete the form before submitting.',
          showProgress: true, // Progress bar enable
          duration: 3,
          placement: 'topRight',
          style: {
            borderRadius: '4px',
          }
        });
      });
  };

//  ya function children ko expend kar raha hai
  const getOptions = (list: DataType[]): { label: string; value: string }[] => {
    let opts: { label: string; value: string }[] = [];
    list.forEach((item) => {
      opts.push({ label: item.name, value: item.key });
      if (item.children) opts = [...opts, ...getOptions(item.children)];
    });
    return opts;
  };
//handle the expend
  const handleExpand = (expanded: boolean, record: DataType) => {
    setExpandedRowKeys((prev) => {
      if (expanded) return prev.includes(record.key) ? prev : [...prev, record.key];
      return prev.filter((key) => key !== record.key);
    });

    if (!expanded || !record.canExpand) return;
    if (record.children && record.children.length > 0) return;
    setDataSource((prev) => addDummyChildren(prev, record.key));
  };
//for refreshing the table
 const handleRefreash=()=>{
setSearchTerm('');
setExpandedRowKeys([]);
setColumnFilters({
  name:'',
  code:'',
department:'',
description:'',
})

 }
 // 1. Search Logic: Ye function check karega ke input text data mein milta hai ya nahi
const getFilteredData = (data: DataType[]): DataType[] => {
  if (!searchTerm.trim()) return data; // Agar search khali hai to poora data dikhao

  const lowerSearch = searchTerm.toLowerCase();

  return data.reduce<DataType[]>((acc, item) => {
    // Check karo ke Parent matches kar raha hai ya nahi
    const matchesParent =
      item.name.toLowerCase().includes(lowerSearch) ||
      item.code.toLowerCase().includes(lowerSearch) ||
      item.department.toLowerCase().includes(lowerSearch);

    // Check karo ke Children matches kar rahe hain ya nahi (Recursive)
    const filteredChildren = item.children ? getFilteredData(item.children) : undefined;
    const hasFilteredChildren = Boolean(filteredChildren && filteredChildren.length > 0);

    // Agar parent match ho jaye YA uske kisi child mein match mil jaye, to usay rakho
    if (matchesParent || hasFilteredChildren) {
      acc.push({
        ...item,
        children: hasFilteredChildren ? filteredChildren : item.children,
      });
    }

    return acc;
  }, []);
};

// 2. Final Data jo Table mein jaye ga
const displayData = getFilteredData(dataSource);

const flattenedVisibleRows = (() => {
  const rows: DataType[] = [];

  const walk = (items: DataType[]) => {
    items.forEach((item) => {
      rows.push(item);
      if (item.children?.length && expandedRowKeys.includes(item.key)) {
        walk(item.children);
      }
    });
  };

  walk(displayData);
  return rows;
})();

const departmentRowSpanByKey = (() => {
  const rowSpanMap: Record<string, number> = {};
  const hiddenKeys = new Set<string>();

  for (let index = 0; index < flattenedVisibleRows.length; index += 1) {
    const current = flattenedVisibleRows[index];

    if (hiddenKeys.has(current.key)) {
      rowSpanMap[current.key] = 0;
      continue;
    }

    const isSameAsParent = Boolean(current.parentDepartment && current.parentDepartment === current.department);
    if (isSameAsParent) {
      rowSpanMap[current.key] = 0;
      continue;
    }

    let span = 1;
    for (let nextIndex = index + 1; nextIndex < flattenedVisibleRows.length; nextIndex += 1) {
      const nextRow = flattenedVisibleRows[nextIndex];
      const nextIsSameAsParent = Boolean(nextRow.parentDepartment && nextRow.parentDepartment === nextRow.department);

      if (!nextIsSameAsParent || nextRow.department !== current.department) break;

      span += 1;
      hiddenKeys.add(nextRow.key);
      rowSpanMap[nextRow.key] = 0;
    }

    rowSpanMap[current.key] = span;
  }

  return rowSpanMap;
})();

  // modal title change hon gay jaisy jaisy form change hoga
  const modalTitle =
    modalMode === 'edit' ? 'Edit Permission' : modalMode === 'add-child' ? 'Add Child Permission' : 'Add Permission';

  return (

    <ConfigProvider
      theme={{
        components: {
          Notification: {
            // progressBg: COLOR_BG, // Progress bar ka gradient color
          },
        },
      }}
    >
    <div className="bg-gray-50 min-h-screen pt-18 p-3">
      {contextHolder}
      
       <Header onAddClick={openAddParentModal} /> {/*is gonna open parent modal which in which ischild chheck is diable ,can only add parent in the table */}
      <Tabs />
      <div className="p-3 bg-white shadow-sm mt-1 mx-2 rounded-sm">
        <div className="permission-toolbar">
          <div className="permission-title-wrap">
            <h2 className="permission-title">Permissions List</h2>
            <ReloadOutlined className="permission-refresh-icon" onClick={handleRefreash}  />
          </div>
          <Space>
            <Input
              allowClear
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="permission-search"
            />
        
          </Space>
        </div>
      {/* main table of the permission  with the data source given above  , with expendable function ,expanding the rows of the parents */}
        <Table
          columns={columns}
          bordered
          dataSource={displayData}
          pagination={false}
          size="small"
          className="permission-table"
          rowKey={(record) => record.key}
          scroll={{ x: 1100 }}   // scroll for scrolling it until 1100
        
        //expendable funtion which is expending the row after checking he conditions
          expandable={{  
            rowExpandable: isExpandableRow,
            expandedRowKeys: expandedRowKeys as Key[],
            onExpand: handleExpand,
            columnWidth: 32,
            expandIcon: ({ expanded, onExpand, record }) => {
              if (!isExpandableRow(record)) return <span className="expand-placeholder" />;
              return (
                <span className="custom-expand-icon" onClick={(e) => onExpand(record, e)} role="button">
                  {expanded ? <DownOutlined /> : <RightOutlined />}
                </span>
              );
            },
          }}
        />
{/* add form model for permission list  ,dynamic , forms will change according to mode select */}
        <Modal open={modalopen}
         onCancel={closeModal}
         footer={null}
         width={1000} 
         centered
         maskClosable={false}>
          <div className="absolute top-0 left-0 right-0 p-3 bg-sky-700 text-white font-bold text-center uppercase text-sm">{modalTitle}</div>
          <div className="mt-12 mb-10">
            <AddForm
              form={form}
              parentOptions={getOptions(dataSource)}
               mode={modalMode} //modalmode depends of which moda mode is open
              lockedParentLabel={selectedRecord?.name}
              lockedParentId={selectedRecord?.key}
            />
       
          </div>
       {/* 
          onsave and in close modal form save or close hojata hai */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center gap-3 p-4 bg-gray-100">

            {/* checking the conditions that which modal mode is edit   */}
            <button onClick={handleSave} className="bg-sky-700 text-white px-6 py-2 font-bold uppercase text-xs hover:bg-sky-800 transition-all rounded-sm">{modalMode === 'edit' ? 'Update' : 'Save'}</button>
            <button onClick={closeModal} className="bg-green-600 hover:bg-gray-500 text-white px-4 py-2 font-bold uppercase text-xs rounded-sm">Cancel</button>
          </div>
        </Modal>
      </div>
    </div>
    </ConfigProvider>
  );
};

export default PermissionList;
