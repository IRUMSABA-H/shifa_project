"use client";

import { useEffect, useRef } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
} from "antd";
import Link from "next/link";
import styles from "./division.module.css";
import { useSubjectiveSummary, type EyeSummary } from "../subjective-context";

type FormValues = {
  division_distance?: "no" | "yes";
  selectedEye?: "left eye" | "right eye";
  sphericalSign?: "" | "+" | "-";
  sphericalstatus?: "no" | "yes";
  sphericalnumber?: string | number;
  sphericaldecimal?: number;
  spherical_axis?: string;
  cylindricalSign?: "" | "+" | "-";
  cylindrical_status?: "no" | "yes";
  cylindericalnumber?: string | number;
  cylindericaldecimal?: number;
  cylindrical_axis_select?: string;
  cylindrical_axis?: string;
  mode?: "system" | "manual";
  systemType?: "british" | "american";
  numerator?: string;
  denominator?: string;
  manualType?: "hand" | "light" | "nolight";
};

type SystemType = NonNullable<FormValues["systemType"]>;

const EMPTY_VALUES: FormValues = {
  sphericalSign: "",
  sphericalstatus: undefined,
  sphericalnumber: undefined,
  sphericaldecimal: undefined,
  spherical_axis: undefined,
  cylindricalSign: "",
  cylindrical_status: undefined,
  cylindericalnumber: undefined,
  cylindericaldecimal: undefined,
  cylindrical_axis_select: undefined,
  cylindrical_axis: undefined,
  mode: undefined,
  systemType: undefined,
  numerator: undefined,
  denominator: undefined,
  manualType: undefined,
};

const getSignedText = (
  value: string | number | undefined,
  decimal?: number,
  suffix?: string,
) => {
  if (value === undefined || value === null || value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "";
  const sign = numeric < 0 ? "-" : "+";
  const whole = Math.abs(numeric).toString();
  const decimalText =
    decimal === undefined || decimal === null
      ? ""
      : `.${decimal.toString().padStart(2, "0")}`;
  return `${sign}${whole}${decimalText}${suffix ? ` ${suffix}` : ""}`.trim();
};

export default function DivisionDistance() {
  const [form] = Form.useForm<FormValues>();
  const previousEyeRef = useRef<FormValues["selectedEye"]>();
  const { summaryRows, updateSummaryRow } = useSubjectiveSummary();
  const distanceRow = summaryRows.find((row) => row.key === "distance-vision");
  const divisionDistance = Form.useWatch("division_distance", form);
  const selectedEye = Form.useWatch("selectedEye", form);
  const sphericalSign = Form.useWatch("sphericalSign", form) ?? "";
  const sphericalValue = Form.useWatch("sphericalnumber", form);
  const cylindricalSign = Form.useWatch("cylindricalSign", form) ?? "";
  const cylindricalValue = Form.useWatch("cylindericalnumber", form);

  useEffect(() => {
    if (divisionDistance !== "yes") {
      previousEyeRef.current = undefined;
      form.setFieldsValue({ selectedEye: undefined, ...EMPTY_VALUES });
      return;
    }

    if (!selectedEye) {
      previousEyeRef.current = undefined;
      form.setFieldsValue(EMPTY_VALUES);
      return;
    }

    const eyeSummary =
      selectedEye === "right eye"
        ? distanceRow?.rightEye
        : distanceRow?.leftEye;
    const values = eyeSummary?.formValues
      ? ({ ...EMPTY_VALUES, ...eyeSummary.formValues } as FormValues)
      : { ...EMPTY_VALUES };
    form.setFieldsValue({
      ...values,
      sphericalSign:
        values.sphericalnumber === undefined || values.sphericalnumber === ""
          ? ""
          : Number(values.sphericalnumber) < 0
            ? "-"
            : "+",
      cylindricalSign:
        values.cylindericalnumber === undefined ||
        values.cylindericalnumber === ""
          ? ""
          : Number(values.cylindericalnumber) < 0
            ? "-"
            : "+",
    });
    previousEyeRef.current = selectedEye;
  }, [distanceRow, divisionDistance, form, selectedEye]);

  const setSignedField = (
    field: "sphericalnumber" | "cylindericalnumber",
    sign: "" | "+" | "-",
    value: number | "",
  ) => {
    if (value === "") {
      form.setFieldsValue({ [field]: "" });
      return;
    }
    form.setFieldsValue({
      [field]: sign === "-" ? -Math.abs(value) : Math.abs(value),
    });
  };

  const setSign = (
    field: "sphericalSign" | "cylindricalSign",
    sign: "" | "+" | "-",
  ) => {
    form.setFieldsValue({ [field]: sign });
    if (field === "sphericalSign") {
      const current = form.getFieldValue("sphericalnumber");
      if (current !== undefined && current !== null && current !== "") {
        setSignedField("sphericalnumber", sign, Math.abs(Number(current)));
      }
      return;
    }
    const current = form.getFieldValue("cylindericalnumber");
    if (current !== undefined && current !== null && current !== "") {
      setSignedField("cylindericalnumber", sign, Math.abs(Number(current)));
    }
  };

  const stepValue = (
    field: "sphericalnumber" | "cylindericalnumber",
    sign: "+" | "-",
  ) => {
    const current = form.getFieldValue(field);
    const currentNumber =
      current === undefined || current === null || current === ""
        ? 0
        : Number(current);
    const next =
      sign === "+"
        ? currentNumber + 1
        : currentNumber > 0
          ? currentNumber - 1
          : currentNumber - 1;
    form.setFieldsValue({ [field]: next });
  };

  const buildVisualAcuity = (values: FormValues) => {
    if (
      values.mode === "system" &&
      values.numerator &&
      values.denominator &&
      values.systemType
    ) {
      return `${values.numerator}/${values.denominator} ${values.systemType}`;
    }
    if (values.mode === "manual") {
      if (values.manualType === "hand") return "Hand Movement";
      if (values.manualType === "light") return "Perception of Light";
      if (values.manualType === "nolight") return "No Perception of Light";
    }
    return "";
  };

  const buildEyeSummary = (values: FormValues): EyeSummary => ({
    spherical:
      values.sphericalstatus === "yes"
        ? getSignedText(
            values.sphericalnumber,
            values.sphericaldecimal,
            values.spherical_axis,
          )
        : "",
    cylindrical:
      values.cylindrical_status === "yes"
        ? getSignedText(
            values.cylindericalnumber,
            values.cylindericaldecimal,
            values.cylindrical_axis_select,
          )
        : "",
    axis:
      values.cylindrical_status === "yes"
        ? (values.cylindrical_axis ?? "")
        : "",
    visualAcuity: buildVisualAcuity(values),
    action: "",
    formValues: { ...EMPTY_VALUES, ...values },
  });

  const persistEye = (eye: FormValues["selectedEye"], values: FormValues) => {
    if (!eye) return;
    const summary = buildEyeSummary(values);
    updateSummaryRow("distance-vision", {
      rightEye: eye === "right eye" ? summary : distanceRow?.rightEye,
      leftEye: eye === "left eye" ? summary : distanceRow?.leftEye,
    });
  };

  const eyeFields = () =>
    form.getFieldsValue([
      "sphericalstatus",
      "sphericalnumber",
      "sphericaldecimal",
      "spherical_axis",
      "cylindrical_status",
      "cylindericalnumber",
      "cylindericaldecimal",
      "cylindrical_axis_select",
      "cylindrical_axis",
      "mode",
      "systemType",
      "numerator",
      "denominator",
      "manualType",
    ]) as FormValues;

  const handleEyeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextEye = event.target.value as FormValues["selectedEye"];
    const previousEye = previousEyeRef.current;
    if (previousEye && previousEye !== nextEye && divisionDistance === "yes") {
      persistEye(previousEye, eyeFields());
    }
    form.setFieldsValue({ selectedEye: nextEye });
  };

  const handleFinish = (values: FormValues) => {
    const completeValues = {
      ...form.getFieldsValue(true),
      ...values,
    } as FormValues;

    if (
      completeValues.division_distance !== "yes" ||
      !completeValues.selectedEye
    ) {
      return;
    }

    persistEye(completeValues.selectedEye, {
      ...EMPTY_VALUES,
      ...completeValues,
    });
  };

  return (
    <Form form={form} layout="horizontal" size="small" onFinish={handleFinish}>
      <Form.Item name="mode" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="sphericalSign" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="cylindricalSign" hidden>
        <Input />
      </Form.Item>
      <div className="flex flex-col gap-3">
        <Row gutter={12}>
          <Col span={3}>
            <span className="font-bold text-black">Divison Distance</span>
          </Col>
          <Col span={3}>
            <Form.Item name="division_distance" noStyle>
              <Radio.Group className={styles.smallRadio}>
                <Radio value="no" className="text-xs">
                  No
                </Radio>
                <Radio value="yes" className="text-xs">
                  Yes
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item noStyle dependencies={["division_distance"]}>
              {({ getFieldValue }) => (
                <Form.Item name="selectedEye" noStyle>
                  <Radio.Group
                    disabled={getFieldValue("division_distance") !== "yes"}
                    size="small"
                    onChange={handleEyeChange}
                  >
                    <Radio value="left eye" className="font-bold">
                      Left Eye
                    </Radio>
                    <Radio value="right eye" className={styles.righteye}>
                      Right Eye
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} align="middle">
          <Col span={3}>
            <span className="text-sm font-bold text-slate-800">Spherical</span>
          </Col>
          <Col span={3}>
            <Form.Item name="sphericalstatus" noStyle>
              <Radio.Group className={styles.smallRadio}>
                <Radio value="no">No</Radio>
                <Radio value="yes">Yes</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item noStyle dependencies={["sphericalstatus"]}>
              {({ getFieldValue }) => {
                const isEnabled = getFieldValue("sphericalstatus") === "yes";
                return (
                  <div
                    className={`flex items-center gap-1 ${!isEnabled ? "opacity-50 pointer-events-none" : ""}`}
                    style={{ filter: !isEnabled ? "grayscale(1)" : "none" }}
                  >
                    <div className="mr-2 flex cursor-pointer select-none flex-col text-[10px] font-bold leading-tight text-slate-500">
                      <span
                        className={`hover:text-blue-500 ${sphericalSign === "+" ? "text-blue-600" : ""}`}
                        onClick={() =>
                          isEnabled && setSign("sphericalSign", "+")
                        }
                      >
                        +
                      </span>
                      <span
                        className={`hover:text-blue-500 ${sphericalSign === "-" ? "text-blue-600" : ""}`}
                        onClick={() =>
                          isEnabled && setSign("sphericalSign", "-")
                        }
                      >
                        -
                      </span>
                    </div>
                    <Form.Item name="sphericalnumber" noStyle>
                      <Input
                        disabled={!isEnabled}
                        placeholder="00"
                        style={{ width: 95 }}
                        className="text-center"
                        addonBefore={
                          <div
                            className="flex h-full w-full select-none items-center justify-center font-bold text-blue-600"
                            style={{
                              minWidth: "8px",
                              cursor:
                                isEnabled && sphericalSign
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() =>
                              isEnabled &&
                              sphericalSign &&
                              stepValue("sphericalnumber", sphericalSign)
                            }
                          >
                            {sphericalSign}
                          </div>
                        }
                        value={
                          sphericalValue === undefined || sphericalValue === ""
                            ? ""
                            : Math.abs(Number(sphericalValue))
                        }
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, "");
                          if (!cleaned)
                            return setSignedField(
                              "sphericalnumber",
                              sphericalSign,
                              "",
                            );
                          setSignedField(
                            "sphericalnumber",
                            sphericalSign,
                            Number(cleaned),
                          );
                        }}
                      />
                    </Form.Item>
                    <span className="text-xl font-bold leading-none">.</span>
                    <Form.Item name="sphericaldecimal" noStyle>
                      <Select
                        disabled={!isEnabled}
                        placeholder="00"
                        style={{ width: 90 }}
                        options={[
                          {
                            label: "00",
                            value: "00",
                          },
                          {
                            label: "25",
                            value: "25",
                          },
                          {
                            label: "50",
                            value: "50",
                          },
                          {
                            label: "75",
                            value: "75",
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                );
              }}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} align="middle">
          <Col span={3}>
            <span className="text-sm font-bold text-slate-800">
              Cylindrical
            </span>
          </Col>
          <Col span={3}>
            <Form.Item name="cylindrical_status" noStyle>
              <Radio.Group className={styles.smallRadio}>
                <Radio value="no">No</Radio>
                <Radio value="yes">Yes</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item noStyle dependencies={["cylindrical_status"]}>
              {({ getFieldValue }) => {
                const isEnabled = getFieldValue("cylindrical_status") === "yes";
                return (
                  <div className="flex w-full items-center">
                    <div
                      className={`flex items-center gap-1 ${!isEnabled ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div className="mr-2 flex cursor-pointer select-none flex-col text-[10px] font-bold leading-tight text-slate-500">
                        <span
                          className={`hover:text-blue-500 ${cylindricalSign === "+" ? "text-blue-600" : ""}`}
                          onClick={() =>
                            isEnabled && setSign("cylindricalSign", "+")
                          }
                        >
                          +
                        </span>
                        <span
                          className={`hover:text-blue-500 ${cylindricalSign === "-" ? "text-blue-600" : ""}`}
                          onClick={() =>
                            isEnabled && setSign("cylindricalSign", "-")
                          }
                        >
                          -
                        </span>
                      </div>
                      <Form.Item name="cylindericalnumber" noStyle>
                        <Input
                          disabled={!isEnabled}
                          placeholder="00"
                          style={{ width: 95 }}
                          className="text-center"
                          addonBefore={
                            <div
                              className="flex h-full w-full select-none items-center justify-center font-bold text-blue-600"
                              style={{
                                minWidth: "8px",
                                cursor:
                                  isEnabled && cylindricalSign
                                    ? "pointer"
                                    : "default",
                              }}
                              onClick={() =>
                                isEnabled &&
                                cylindricalSign &&
                                stepValue("cylindericalnumber", cylindricalSign)
                              }
                            >
                              {cylindricalSign}
                            </div>
                          }
                          value={
                            cylindricalValue === undefined ||
                            cylindricalValue === ""
                              ? ""
                              : Math.abs(Number(cylindricalValue))
                          }
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^0-9]/g,
                              "",
                            );
                            if (!cleaned)
                              return setSignedField(
                                "cylindericalnumber",
                                cylindricalSign,
                                "",
                              );
                            setSignedField(
                              "cylindericalnumber",
                              cylindricalSign,
                              Number(cleaned),
                            );
                          }}
                        />
                      </Form.Item>
                      <span className="text-xl font-bold leading-none">.</span>
                      <Form.Item name="cylindericaldecimal" noStyle>
                        <Select
                        disabled={!isEnabled}
                        placeholder="00"
                        style={{ width: 90 }}
                        options={[
                          {
                            label: "00",
                            value: "00",
                          },
                          {
                            label: "25",
                            value: "25",
                          },
                          {
                            label: "50",
                            value: "50",
                          },
                          {
                            label: "75",
                            value: "75",
                          },
                        ]}
                      />
                      </Form.Item>
                    
                    </div>
                  </div>
                );
              }}
            </Form.Item>
          </Col>
          <Col span={11}>
            <div className="ml-5 flex gap-3">
              <span className="ml-3 font-bold text-sky-700">Axis</span>
              <Form.Item name="cylindrical_axis" noStyle>
                <Input style={{ width: 290 }} placeholder="Specify Axis..." />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 0]} className={styles.visualAcuityRow}>
          <Col span={3} className="pt-1 font-bold">
            visual Acuity
          </Col>
          <Col>
            <div className={styles.visualAcuityCompact}>
              <Row gutter={[12, 0]} align="middle">
                <Col span={4}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) => prev.mode !== curr.mode}
                  >
                    {({ getFieldValue, setFieldsValue }) => (
                      <Radio
                        checked={getFieldValue("mode") === "system"}
                        onChange={() =>
                          setFieldsValue({
                            mode: "system",
                            manualType: undefined,
                          })
                        }
                      >
                        System Based
                      </Radio>
                    )}
                  </Form.Item>
                </Col>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.mode !== curr.mode ||
                    prev.systemType !== curr.systemType
                  }
                >
                  {({ getFieldValue, setFieldsValue }) => {
                    const isSystem = getFieldValue("mode") === "system";
                    const systemType = getFieldValue("systemType");
                    const denominatorOptions =
                      systemType === "british"
                        ? Array.from({ length: 10 }, (_, i) => ({
                            value: `${i + 1}`,
                            label: `${i + 1}`,
                          }))
                        : systemType === "american"
                          ? Array.from({ length: 10 }, (_, i) => ({
                              value: `${i + 11}`,
                              label: `${i + 11}`,
                            }))
                          : [];
                    return (
                      <>
                        <Col span={10}>
                          <Form.Item
                            name="systemType"
                            noStyle
                            rules={[{ required: isSystem, message: "" }]}
                          >
                            <Radio.Group
                              className={styles.radiogroup}
                              disabled={!isSystem}
                              value={getFieldValue("systemType")}
                              onChange={(e) => {
                                const nextSystemType = e.target.value as
                                  | SystemType
                                  | undefined;
                                setFieldsValue({
                                  systemType: nextSystemType,
                                  numerator:
                                    nextSystemType === "american"
                                      ? "20"
                                      : nextSystemType === "british"
                                        ? "6"
                                        : undefined,
                                  denominator: undefined,
                                });
                              }}
                            >
                              <Radio
                                value="british"
                                name="british"
                                className={styles.radiogroup}
                              >
                                British System (meters)
                              </Radio>
                              <Radio value="american">
                                American System (feet)
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={3} className="mr-9">
                          <div className="flex flex-row items-center gap-2">
                            <span>Numerator</span>
                            <Form.Item
                              name="numerator"
                              className="mb-0"
                              rules={[{ required: isSystem, message: "" }]}
                            >
                              <Input
                                style={{ width: 75 }}
                                disabled={!isSystem || !systemType}
                                readOnly
                              />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={3} className="ml-3">
                          <div className="flex flex-row items-center gap-2">
                            <span>/Denominator</span>
                            <Form.Item
                              name="denominator"
                              className="mb-0"
                              rules={[{ required: isSystem, message: "" }]}
                            >
                              <Select
                                style={{ width: 75 }}
                                disabled={!isSystem || !systemType}
                                options={denominatorOptions}
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
              </Row>
              <Row gutter={[12, 0]} align="middle" className="mt-4">
                <Col span={3}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) => prev.mode !== curr.mode}
                  >
                    {({ getFieldValue, setFieldsValue }) => (
                      <Radio
                        checked={getFieldValue("mode") === "manual"}
                        onChange={() =>
                          setFieldsValue({
                            mode: "manual",
                            systemType: undefined,
                            numerator: undefined,
                            denominator: undefined,
                          })
                        }
                      >
                        Manual
                      </Radio>
                    )}
                  </Form.Item>
                </Col>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) => prev.mode !== curr.mode}
                >
                  {({ getFieldValue }) => {
                    const isManual = getFieldValue("mode") === "manual";
                    return (
                      <>
                        <Col span={16}>
                          <Form.Item
                            name="manualType"
                            className="mb-0"
                            rules={[{ required: isManual, message: "" }]}
                          >
                            <Radio.Group
                              disabled={!isManual}
                              className="flex items-center gap-6"
                            >
                              <Radio
                                value="hand"
                                name="systemType"
                                className={styles.hand}
                              >
                                Hand Movement
                              </Radio>
                              <Radio value="light" className={styles.light}>
                                Perception of Light
                              </Radio>
                              <Radio value="nolight" className={styles.nolight}>
                                No Perception of Light
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item noStyle>
                            <div className="mb-0 ml-5 flex flex-row items-center gap-1">
                              <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.saveButton}
                              >
                                Save
                              </Button>
                              <Link href="/orthoptic/refracion/subjective/InterMediatevision">
                                <Button
                                  type="primary"
                                  className={styles.nextButton}
                                >
                                  Next
                                </Button>
                              </Link>
                            </div>
                          </Form.Item>
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </Form>
  );
}
