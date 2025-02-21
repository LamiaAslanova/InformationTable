import { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [rows, setRows] = useState([{ id: Date.now() }]);
  const [openModalId, setOpenModalID] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
      const employeesWithIds = res.data.map((employee) => ({
        ...employee,
        employeeId: generateEmployeeId(),
      }));
      setEmployees(employeesWithIds);
    });
  }, []);

  const generateEmployeeId = () => {
    const lastDigitOptions = [1, 2, 3];
    const lastDigit =
      lastDigitOptions[Math.floor(Math.random() * lastDigitOptions.length)];
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${randomNumber}${lastDigit}`;
  };

  const formik = useFormik({
    initialValues: {},
  });

  const employeeSelect = (value, rowId) => {
    const employee = employees.find(
      (employee) => employee.employeeId === value
    );
    if (employee) {
      formik.setFieldValue(`${rowId}_selectedEmployeeId`, employee.employeeId);
      formik.setFieldValue(`${rowId}_selectedEmployeeName`, employee.name);
    } else {
      formik.setFieldValue(`${rowId}_selectedEmployeeId`, "");
      formik.setFieldValue(`${rowId}_selectedEmployeeName`, "");
    }
  };

  const getDocumentById = (id, name) => {
    if (!id) return "Seçilməyib";
    const lastDigit = id.slice(-1);
    if (lastDigit === "1") return `${name} ərizəsi`;
    else if (lastDigit === "2") return `${name} təqdimatı`;
    else return `${name} razılıq ərizəsi`;
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now() }]);
  };

  const openModal = (rowId) => {
    setOpenModalID(rowId);
  };

  const closeModal = () => {
    setOpenModalID(null);
  };

  return (
    <div className="app p-6 bg-gradient-to-r from-slate-900 to-stone-800 min-h-screen">
      <div className="heading flex justify-between mr-5 mt-4 mb-5">
        <h1 className="text-2xl font-bold text-white">İşçi Məlumatları</h1>
        <Button
          className="px-6 h-12 text-medium min-w-24 rounded-large"
          color="primary"
          onPress={addRow}
        >
          Əlavə Et
        </Button>
      </div>
      <div className="body">
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn className="text-center">Sıra</TableColumn>
            <TableColumn className="text-center">İşçi</TableColumn>
            <TableColumn className="text-center">Xüsusi qeyd</TableColumn>
            <TableColumn className="text-center">Əməliyyat</TableColumn>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Autocomplete
                    className="w-full"
                    label="İşçilər"
                    onSelectionChange={(value) => employeeSelect(value, row.id)}
                  >
                    {employees.map((employee) => (
                      <AutocompleteItem
                        key={employee.employeeId}
                        value={employee.employeeId}
                      >{`${employee.employeeId} - ${employee.name}`}</AutocompleteItem>
                    ))}
                  </Autocomplete>
                </TableCell>
                <TableCell>
                  <Input
                    label="Xüsusi qeyd"
                    type="text"
                    value={formik.values[`${row.id}_specialNote`] || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `${row.id}_specialNote`,
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="buttons flex justify-center gap-10">
                    <Button
                      className="px-6 h-12 text-medium min-w-24 rounded-large text-white"
                      color="success"
                      onPress={() => openModal(row.id)}
                    >
                      Baxış
                    </Button>
                    <Modal
                      isOpen={openModalId === row.id}
                      onOpenChange={closeModal}
                    >
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                              İşçi Məlumatı
                            </ModalHeader>
                            <ModalBody className="grid grid-cols-2 gap-6">
                              <div>
                                <p className="font-bold mb-2">İşçi Nömrəsi:</p>
                                <span className="text-blue-500">
                                  {formik.values[
                                    `${row.id}_selectedEmployeeId`
                                  ] || "Seçilməyib"}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold mb-2">Adı Soyadı:</p>
                                <span>
                                  {formik.values[
                                    `${row.id}_selectedEmployeeName`
                                  ] || "Seçilməyib"}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold mb-2">
                                  Əmrin əsas səbəbi:
                                </p>
                                <span>
                                  {getDocumentById(
                                    formik.values[
                                      `${row.id}_selectedEmployeeId`
                                    ],
                                    formik.values[
                                      `${row.id}_selectedEmployeeName`
                                    ]
                                  )}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold mb-2">Qeyd:</p>
                                <span>
                                  {formik.values[`${row.id}_specialNote`] ||
                                    "Qeyd daxil edilməyib"}
                                </span>
                              </div>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="primary" onPress={onClose}>
                                Bağla
                              </Button>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                    <Button
                      className="px-6 h-12 text-medium min-w-24 rounded-large"
                      color="danger"
                      onPress={() =>
                        setRows(rows.filter((r) => r.id !== row.id))
                      }
                    >
                      Sil
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default App;
