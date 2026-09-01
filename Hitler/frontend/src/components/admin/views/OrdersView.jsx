import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Modal from '../../ui/Modal';
import Badge from '../../ui/Badge';
import Pagination from '../../ui/Pagination';
import EmptyState from '../../ui/EmptyState';
import Loader from '../../ui/Loader';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';
import { formatMoney } from '../../../utils/formatters';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const itemsPerPage = 7;

  const fetchOrders = () => {
    setLoading(true);
    axios.get(`/api/admin/orders?search=${encodeURIComponent(search)}&status=${statusFilter}`)
      .then(res => setOrders(res.data))
      .catch(() => addToast("Buyurtmalarni yuklashda xatolik", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleStatusChange = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios.put(`/api/admin/orders/${activeOrder.id}`, { orderStatus: newOrderStatus })
      .then(() => {
        addToast("Buyurtma holati o'zgartirildi", "success");
        setShowEditModal(false);
        fetchOrders();
      })
      .catch(() => addToast("Xatolik yuz berdi", "error"))
      .finally(() => setSubmitting(false));
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'info';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Orders Management</h2>
        <p className="view-subtitle">Mijozlar buyurtmalari, to'lov va yetkazib berish holatlari</p>
      </div>

      {/* Filters */}
      <div className="filter-card">
        <div className="filter-grid-2">
          <Input
            placeholder="Order ID, mijoz ismi yoki mahsulot bo'yicha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon="🔍"
          />
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { label: "Barcha Holatlar", value: "" },
              { label: "Pending", value: "Pending" },
              { label: "Processing", value: "Processing" },
              { label: "Shipped", value: "Shipped" },
              { label: "Delivered", value: "Delivered" },
              { label: "Cancelled", value: "Cancelled" },
            ]}
          />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader text="Buyurtmalar yuklanmoqda..." />
      ) : paginatedOrders.length === 0 ? (
        <EmptyState title="Buyurtma topilmadi" description="Qidiruv shartlarini o'zgartiring" />
      ) : (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Mijoz</th>
                <th>Mahsulot</th>
                <th>To'lov Holati</th>
                <th>Buyurtma Holati</th>
                <th>Sana</th>
                <th>Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(ord => (
                <tr key={ord.id}>
                  <td><strong>{ord.orderNumber}</strong></td>
                  <td>
                    <div className="table-user-cell">
                      <span>{ord.customerName}</span>
                    </div>
                  </td>
                  <td>{ord.productName}</td>
                  <td>
                    <Badge variant={ord.paymentStatus === 'paid' ? 'success' : 'danger'}>
                      {ord.paymentStatus}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={getBadgeVariant(ord.orderStatus)}>
                      {ord.orderStatus}
                    </Badge>
                  </td>
                  <td>{ord.createdAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-action-btn" title="Batafsil" onClick={() => { setActiveOrder(ord); setShowViewModal(true); }}>👁️</button>
                      <button className="icon-action-btn" title="Holatni O'zgartirish" onClick={() => { setActiveOrder(ord); setNewOrderStatus(ord.orderStatus); setShowEditModal(true); }}>✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Edit Order Status Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Buyurtma Holatini O'zgartirish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button variant="primary" loading={submitting} onClick={handleStatusChange}>Saqlash</Button>
          </>
        }
      >
        {activeOrder && (
          <form onSubmit={handleStatusChange}>
            <p><strong>{activeOrder.orderNumber}</strong> uchun yangi holatni tanlang:</p>
            <Select
              label="Buyurtma Holati"
              value={newOrderStatus}
              onChange={e => setNewOrderStatus(e.target.value)}
              options={["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]}
            />
          </form>
        )}
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Buyurtma Tafsilotlari"
        footer={<Button variant="secondary" onClick={() => setShowViewModal(false)}>Yopish</Button>}
      >
        {activeOrder && (
          <div className="order-details-card">
            <div className="order-details-header">
              <h4>{activeOrder.orderNumber}</h4>
              <Badge variant={getBadgeVariant(activeOrder.orderStatus)}>{activeOrder.orderStatus}</Badge>
            </div>
            <hr />
            <div className="details-row"><strong>Mijoz:</strong> {activeOrder.customerName} ({activeOrder.customerEmail})</div>
            <div className="details-row"><strong>Mahsulot / Kurs:</strong> {activeOrder.productName}</div>
            <div className="details-row"><strong>To'lov Holati:</strong> <Badge variant={activeOrder.paymentStatus === 'paid' ? 'success' : 'danger'}>{activeOrder.paymentStatus}</Badge></div>
            <div className="details-row"><strong>Sana:</strong> {activeOrder.createdAt}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
