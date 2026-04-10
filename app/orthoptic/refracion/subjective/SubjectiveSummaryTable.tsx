"use client";

import type { ReactNode } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import styles from "./subjectivetable.module.css";
import { useSubjectiveSummary, type SummaryRow } from "./subjective-context";

// --- Core Logic: Flattened Columns ---
// Image jaisa banane ke liye hum children (nested headers) use nahi karenge.
type MergedCell = {
  children: ReactNode;
  props: {
    colSpan?: number;
  };
};

const isMergedVisionRow = (key: string) =>
  key === "intermediate-vision" || key === "near-vision";

const isInterpupillaryRow = (key: string) => key === "interpupillary-distance";

const columns: ColumnsType<SummaryRow> = [
  {
    title: "",
    dataIndex: "label",
    key: "label",
    width: 200,
    className: styles.labelColumn, // Custom class for first column
    render: (value: string) => (
      <span className="font-bold text-slate-800">{value}</span>
    ),
  },
  // Right Eye Section (Flattened)
  {
    title: "Spherical (SPH)", // Title will be overridden by custom header
    dataIndex: ["rightEye", "spherical"],
    key: "right-spherical",
    width: 220,
    render: (text, record) => {
      const obj: MergedCell = { children: text, props: {} };
      if (isMergedVisionRow(record.key)) {
        obj.props.colSpan = 4;
      }
      if (isInterpupillaryRow(record.key)) {
        obj.children = [text, record.rightEye.cylindrical, record.rightEye.axis]
          .filter(Boolean)
          .join("   ");
        obj.props.colSpan = 11;
      }
      return obj;
    },
  },
  {
    title: "Cylindrical (CYL)",
    dataIndex: ["rightEye", "cylindrical"],
    width: 150,
    render: (text, record) => {
      if (isMergedVisionRow(record.key) || isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return text;
    },
  },
  {
    title: "AXIS",
    dataIndex: ["rightEye", "axis"],
    width: 80,
    render: (text, record) => {
      if (isMergedVisionRow(record.key) || isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return text;
    },
  },
  {
    title: "Visual Acuity (VA)",
    dataIndex: ["rightEye", "visualAcuity"],
    width: 150,
    render: (text, record) => {
      if (isMergedVisionRow(record.key) || isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return text;
    },
  },
  {
    title: "Action",
    width: 72,
    className: styles.rightActionColumn,
    render: (_, record) => {
      if (isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return "";
    },
  },

  // Gap Column (To create space between Right and Left Eye tables)
  {
    title: "",
    key: "gap",
    width: 1,
    className: styles.gapColumn,
    render: (_, record) => {
      if (isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return "";
    },
    onHeaderCell: () => ({
      className: styles.gapHeaderCell,
    }),
  },

  // Left Eye Section (Flattened)
  {
    title: "Spherical (SPH)",
    dataIndex: ["leftEye", "spherical"],
    width: 214,
    render: (text, record) => {
      const obj: MergedCell = { children: text, props: {} };
      if (isMergedVisionRow(record.key)) {
        obj.props.colSpan = 4;
      }
      if (isInterpupillaryRow(record.key)) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  },
  {
    title: "Cylindrical (CYL)",
    dataIndex: ["leftEye", "cylindrical"],
    width: 150,
    render: (text, record) => {
      if (isMergedVisionRow(record.key) || isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return text;
    },
  },
  {
    title: "AXIS",
    dataIndex: ["leftEye", "axis"],
    width: 80,
    render: (text, record) => {
      if (isMergedVisionRow(record.key) || isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return text;
    },
  },
  {
    title: "Visual Acuity (VA)",
    dataIndex: ["leftEye", "visualAcuity"],
    width: 150,
    render: (text, record) => {
      if (isMergedVisionRow(record.key) || isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return text;
    },
  },
  {
    title: "Action",
    width: 72,
    className: styles.leftActionColumn,
    render: (_, record) => {
      if (isInterpupillaryRow(record.key)) {
        return { props: { colSpan: 0 } };
      }
      return "";
    },
  },
];

export default function SubjectiveSummaryTable() {
  const { summaryRows } = useSubjectiveSummary();

  return (
    <section className="mt-4 p-2 rounded-md bg-white ">
      <Table
        bordered
        columns={columns}
        dataSource={summaryRows}
        pagination={false}
        size="large"
        className={styles.summaryTable}  
        // --- Header Components ---
        //   header rows ko customize
        components={{
          header: {
            //  customize  defaut row for right and left eye label
            row: (props) => {
              return <tr {...props} className={styles.customHeaderRow} />;
            },

            wrapper: ({ children, className, ...restProps }) => (
              <thead className={className} {...restProps}>
                {/* 1. First Header Row: "Right Eye" and "Left Eye" labels */}
                <tr className={styles.eyeLabelRow}>
                  <th colSpan={1} className={styles.emptyTh}></th>{" "}
                  {/* Label column ke liye empty th */}
                  <th colSpan={5} className={styles.eyeLabelTh}>
                    Right Eye
                  </th>
                  <th colSpan={1} className={styles.gapTh}></th>{" "}
                  {/* Gap column ke liye empty th */}
                  <th colSpan={5} className={styles.eyeLabelTh}>
                    Left Eye
                  </th>
                </tr>
                {/*  all the other columns data here.. */}
                {children}
              </thead>
            ),
          },
        }}
      />
    </section>
  );
}
