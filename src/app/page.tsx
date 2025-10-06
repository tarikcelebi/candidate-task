"use client";

import { useEffect, useState } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  bulkImport,
} from "../api";
import { Address } from "../types/address";
import "./HomePage.css";

export default function HomePage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Omit<Address, "_id">>({
    region: "",
    city: "",
    branchNumber: "",
    address: "",
    phone: "",
    workingHours: { monWed: "", satSun: "" },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Address | null>(null);
  const [bulkText, setBulkText] = useState("");

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res);
    } catch (err) {
      console.error("fetchAddressErr", err);
    }
  };
  // ---- READ ----
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      alert("Please paste some address text!");
      return;
    }

    try {
      const res = await bulkImport(bulkText); // send the raw line
      if (res.status === 201) {
        alert("Imported successfully!");
        setBulkText("");
        fetchAddresses();
      } else {
        alert(res.data?.error || "Import failed");
      }
    } catch (err: any) {
      console.error("bulkImportErr", err);
      alert(err.response?.data?.error || "Error importing data");
    }
  };

  // ---- CREATE ----
  const handleAddAddress = async () => {
    try {
      const res = await addAddress(newAddress);
      setAddresses([...addresses, res.data]);
      setNewAddress({
        region: "",
        city: "",
        branchNumber: "",
        address: "",
        phone: "",
        workingHours: { monWed: "", satSun: "" },
      });
    } catch (err) {
      console.error("addAddressErr", err);
    }
  };

  // ---- UPDATE ----
  const handleEdit = (addr: Address) => {
    setEditingId(addr._id);
    setEditData({ ...addr });
  };

  const handleUpdate = async (id: string) => {
    if (!editData) return;
    try {
      const res = await updateAddress(id, editData);
      setAddresses(addresses.map((a) => (a._id === id ? res.data : a)));
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      console.error("updateAddressErr", err);
    }
  };

  // ---- DELETE ----
  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err) {
      console.error("deleteAddressErr", err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Відділення Нової Пошти в місті Одеса</h1>

      {/* Desktop Table */}
      <table className="desktop-table">
        <thead>
          <tr>
            <th>Відділення / Поштомат</th>
            <th>Адреса</th>
            <th>Графік роботи</th>
            <th>Телефон</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((addr) =>
            editingId === addr._id ? (
              <tr key={addr._id} className="editing-row">
                <td>
                  <input
                    value={editData?.branchNumber || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData!,
                        branchNumber: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    value={editData?.address || ""}
                    onChange={(e) =>
                      setEditData({ ...editData!, address: e.target.value })
                    }
                  />
                </td>
                <td>
                  <div className="working-hours">
                    <span className="label">пн-пт:</span>
                    <input
                      value={editData?.workingHours.monWed || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData!,
                          workingHours: {
                            ...editData!.workingHours,
                            monWed: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="working-hours">
                    <span className="label">сб-нд:</span>
                    <input
                      value={editData?.workingHours.satSun || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData!,
                          workingHours: {
                            ...editData!.workingHours,
                            satSun: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </td>
                <td>
                  <input
                    value={editData?.phone || ""}
                    onChange={(e) =>
                      setEditData({ ...editData!, phone: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleUpdate(addr._id)}>💾</button>
                  <button onClick={() => setEditingId(null)}>✖️</button>
                </td>
              </tr>
            ) : (
              <tr key={addr._id}>
                <td className="branch">Відд {addr.branchNumber}</td>
                <td>{addr.address}</td>
                <td>
                  <div className="working-hours">
                    <span className="label">пн-пт:</span>
                    <span>{addr.workingHours.monWed}</span>
                  </div>
                  <div className="working-hours">
                    <span className="label">сб-нд:</span>
                    <span>{addr.workingHours.satSun}</span>
                  </div>
                </td>
                <td>{addr.phone}</td>
                <td>
                  <button onClick={() => handleEdit(addr)}>✏️</button>
                  <button onClick={() => handleDelete(addr._id)}>🗑️</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Mobile Table */}
      <div className="mobile-cards">
        {addresses.map((addr) => (
          <div key={addr._id} className="mobile-card">
            <div className="branch">Відд {addr.branchNumber}</div>
            <div className="address">{addr.address}</div>
            <div className="working-hours">
              <span className="label">пн-пт:</span> {addr.workingHours.monWed}
            </div>
            <div className="working-hours">
              <span className="label">сб-нд:</span> {addr.workingHours.satSun}
            </div>
            <div className="phone">{addr.phone}</div>

            <div className="actions">
              <button onClick={() => handleEdit(addr)}>✏️</button>
              <button onClick={() => handleDelete(addr._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Address */}
      <div className="add-form">
        <h3>➕ Додати нове відділення</h3>
        <div className="input-row">
          <input
            placeholder="Branch Number"
            value={newAddress.branchNumber}
            onChange={(e) =>
              setNewAddress({ ...newAddress, branchNumber: e.target.value })
            }
          />
          <input
            placeholder="Address"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
          />
          <input
            placeholder="пн-пт:"
            value={newAddress.workingHours.monWed}
            onChange={(e) =>
              setNewAddress({
                ...newAddress,
                workingHours: {
                  ...newAddress.workingHours,
                  monWed: e.target.value,
                },
              })
            }
          />
          <input
            placeholder="сб-нд:"
            value={newAddress.workingHours.satSun}
            onChange={(e) =>
              setNewAddress({
                ...newAddress,
                workingHours: {
                  ...newAddress.workingHours,
                  satSun: e.target.value,
                },
              })
            }
          />
          <input
            placeholder="Phone"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
          />
          <button onClick={handleAddAddress}>Add</button>
        </div>
      </div>

      <div className="bulk-import">
        <h3>Bulk Import</h3>
        <textarea
          placeholder="Paste address lines here..."
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
        />
        <button onClick={handleBulkImport}>Import</button>
      </div>
    </div>
  );
}
