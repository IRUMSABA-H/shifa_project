"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type EyeSummary = {
  spherical: string;
  cylindrical: string;
  axis: string;
  visualAcuity: string;
  action?: string;
  formValues?: Record<string, string | number | undefined>;
};

export type SummaryRow = {
  key: string;
  label: string;
  rightEye: EyeSummary;
  leftEye: EyeSummary;
};

const defaultSummaryRows: SummaryRow[] = [
  {
    key: "distance-vision",
    label: "Distance Vision (D.V)",
    rightEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
    leftEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
  },
  {
    key: "intermediate-vision",
    label: "Intermediate Vision",
    rightEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
    leftEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
  },
  {
    key: "near-vision",
    label: "Near Vision",
    rightEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
    leftEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
  },
  {
    key: "interpupillary-distance",
    label: "Interpupillary Distance",
    rightEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
    leftEye: {
      spherical: "",
      cylindrical: "",
      axis: "",
      visualAcuity: "",
      action: "",
    },
  },
];

type SubjectiveContextValue = {
  summaryRows: SummaryRow[];
  updateSummaryRow: (key: string, nextRow: Partial<SummaryRow>) => void;
};

const SubjectiveContext = createContext<SubjectiveContextValue | undefined>(
  undefined,
);

export function SubjectiveProvider({ children }: { children: ReactNode }) {
  const [summaryRows, setSummaryRows] =
    useState<SummaryRow[]>(defaultSummaryRows);

  const updateSummaryRow = (key: string, nextRow: Partial<SummaryRow>) => {
    setSummaryRows((currentRows) =>
      currentRows.map((row) =>
        row.key === key
          ? {
              ...row,
              ...nextRow,
              rightEye: {
                ...row.rightEye,
                ...nextRow.rightEye,
              },
              leftEye: {
                ...row.leftEye,
                ...nextRow.leftEye,
              },
            }
          : row,
      ),
    );
  };

  const value = useMemo(
    () => ({
      summaryRows,
      updateSummaryRow,
    }),
    [summaryRows],
  );

  return (
    <SubjectiveContext.Provider value={value}>
      {children}
    </SubjectiveContext.Provider>
  );
}

export function useSubjectiveSummary() {
  const context = useContext(SubjectiveContext);

  if (!context) {
    throw new Error(
      "useSubjectiveSummary must be used within a SubjectiveProvider",
    );
  }

  return context;
}
