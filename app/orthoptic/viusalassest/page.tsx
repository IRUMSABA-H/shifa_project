"use client";
import { useState } from "react";
import { Checkbox, Table, Input,Button } from "antd"; // Input import kiya
import { TableOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import "../orthoptic.css";

interface TableRow {
  key: string;
  chart: string;
  note?: string;
  right?: string;
  left?: string;
  withoutright?: string;
  withoutleft?: string;
}

const VisualAssest = () => {
  // 1. States merge aur fix kiye
  const [isVisualAcuityYes, setIsVisualAcuityYes] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState("");
  const [savedData, setSavedData] = useState<Record<string, TableRow[]>>({});
  
  const [vaInputs, setVaInputs] = useState({
    withGlasses: false,
    withoutGlasses: false,
    right: "",
    left: "",
    withoutright: "",
    withoutleft: "",
  });

  // 2. Handlers fix kiye
  const handleVAInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVaInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleVACheckboxChange = (e: CheckboxChangeEvent) => {
    const { name, checked } = e.target;
    if (!name) return;
    setVaInputs((prev) => ({ ...prev, [name]: checked }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
  };

  const handleChartSelect = (chart: string) => {
    setSelectedChart(chart);
    setVaInputs({
      withGlasses: false,
      withoutGlasses: false,
      right: "",
      left: "",
      withoutright: "",
      withoutleft: "",
    });
    setCurrentNote("");
  };

  const handleSave = () => {
    if (!selectedChart) return;
    
    const newEntry: TableRow = {
      key: Date.now().toString(),
      chart: selectedChart,
    };

    if (["OPTOKINETIC NYSTAGMUS", "LEA gratings"].includes(selectedChart)) {
      if (!currentNote.trim()) return;
      newEntry.note = currentNote;
    } else {
      newEntry.right = vaInputs.right;
      newEntry.left = vaInputs.left;
      newEntry.withoutright = vaInputs.withoutright;
      newEntry.withoutleft = vaInputs.withoutleft;
    }

    setSavedData((prev) => ({
      ...prev,
      [selectedChart]: [...(prev[selectedChart] || []), newEntry],
    }));

    // Reset fields after save
    setCurrentNote("");
    setVaInputs({
      withGlasses: false,
      withoutGlasses: false,
      right: "",
      left: "",
      withoutright: "",
      withoutleft: "",
    });
  };

  const vaColumns = [
    { title: "Right (With)", dataIndex: "right", key: "right", render: (text: string) => text || "-" },
    { title: "Left (With)", dataIndex: "left", key: "left", render: (text: string) => text || "-" },
    { title: "Right (W/O)", dataIndex: "withoutright", key: "withoutright", render: (text: string) => text || "-" },
    { title: "Left (W/O)", dataIndex: "withoutleft", key: "withoutleft", render: (text: string) => text || "-" },
  ];

  // Note column for specific charts
  const noteColumn = [
    { title: "Assessment Notes", dataIndex: "note", key: "note" }
  ];

  return (
    <> {/* Fragment added to wrap multiple divs */}
      
      
      <div className="mt-1 pt-2">
        <div className="flex items-center justify-between p-4 rounded-lg mb-6 bg-white">
          <p className="text-black font-bold underline text-sm uppercase">
            Visual Acuity Assessment
          </p>
          <div className="flex gap-6">
            <Checkbox
              checked={isVisualAcuityYes}
              onChange={(e) => setIsVisualAcuityYes(e.target.checked)}
            >
              <span className="text-xs">Yes</span>
            </Checkbox>
            <Checkbox
              checked={!isVisualAcuityYes}
              onChange={(e) => setIsVisualAcuityYes(!e.target.checked)}
            >
              <span className="text-xs">No</span>
            </Checkbox>
          </div>
        </div>

        {isVisualAcuityYes && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border rounded-xl overflow-hidden shadow-sm bg-white">
            {/* Left Side: Navigation */}
            <div className="lg:col-span-4 bg-gray-50 p-5 border-r">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-wider">
                Types of Charts
              </p>
              <div className="space-y-2">
                {[
                  "OPTOKINETIC NYSTAGMUS",
                  "LEA gratings",
                  "LEA symbols",
                  "Picture Chart",
                  "E-Chart",
                  "Snellen Chart",
                ].map((chart) => (
                  <div
                    key={chart}
                    onClick={() => handleChartSelect(chart)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all flex items-center justify-between ${
                      selectedChart === chart 
                        ? "bg-white border-sky-500 shadow-sm" 
                        : "bg-transparent border-transparent hover:bg-gray-200"
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${selectedChart === chart ? "text-sky-600" : "text-gray-600"}`}>
                      {chart}
                    </span>
                    {selectedChart === chart && <CheckCircleOutlined className="text-sky-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Content Area */}
            <div className="lg:col-span-8 bg-white p-8 min-h-[400px]">
              {!selectedChart ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50">
                  <TableOutlined style={{ fontSize: "48px" }} />
                  <p className="mt-4 font-medium italic">Select a chart to record or view data</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-6 border-b pb-2">
                    <h2 className="text-sm font-bold text-sky-700 uppercase">
                      Assessment: {selectedChart}
                    </h2>
                  </div>

                  {["OPTOKINETIC NYSTAGMUS", "LEA gratings"].includes(selectedChart) ? (
                    <div>
                      <textarea
                        value={currentNote}
                        onChange={handleNoteChange}
                        placeholder="Enter notes for this chart assessment..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm mb-4"
                      />
                      <div className="flex justify-end">
                         <Button type="primary" onClick={handleSave} className="button">Save </Button>
                      </div>
                      
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* With Glasses Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border">
                            <Checkbox name="withGlasses" checked={vaInputs.withGlasses} onChange={handleVACheckboxChange} />
                            <span className="text-[10px] font-bold text-sky-600 uppercase">With Glasses</span>
                          </div>
                          <div className="flex gap-2">
                            <Input name="right" value={vaInputs.right} onChange={handleVAInputChange} placeholder="Right" className="text-center" />
                            <Input name="left" value={vaInputs.left} onChange={handleVAInputChange} placeholder="Left" className="text-center" />
                          </div>
                        </div>

                        {/* Without Glasses Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border">
                            <Checkbox name="withoutGlasses" checked={vaInputs.withoutGlasses} onChange={handleVACheckboxChange} />
                            <span className="text-[10px] font-bold text-sky-600 uppercase">Without Glasses</span>
                          </div>
                          <div className="flex gap-2">
                            <Input name="withoutright" value={vaInputs.withoutright} onChange={handleVAInputChange} placeholder="Right" className="text-center" />
                            <Input name="withoutleft" value={vaInputs.withoutleft} onChange={handleVAInputChange} placeholder="Left" className="text-center" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center mb-8">
                        <Button type="primary" onClick={handleSave} className="button">Save </Button>
                      </div>

                      <Table
                        dataSource={savedData[selectedChart] || []}
                        columns={vaColumns}
                        pagination={false}
                        bordered
                        size="small"
                        className="visual"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VisualAssest;
