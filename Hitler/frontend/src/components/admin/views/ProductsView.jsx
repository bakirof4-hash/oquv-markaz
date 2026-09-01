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

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Programming', price: '', stock: '', status: 'active', image_url: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const itemsPerPage = 6;

  const fetchProducts = () => {
    setLoading(true);
    axios.get(`/api/admin/products?search=${encodeURIComponent(search)}&category=${categoryFilter}&status=${statusFilter}`)
      .then(res => setProducts(res.data))
      .catch(() => addToast("Mahsulotlarni yuklashda xatolik", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, statusFilter]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Mahsulot nomi majburiy";
    if (formData.stock === '' || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = "Tog'ri zaxira (stock) sonini kiriting";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    axios.post('/api/admin/products', formData)
      .then(() => {
        addToast("Mahsulot qo'shildi", "success");
        setShowAddModal(false);
        setFormData({ name: '', description: '', category: 'Programming', price: '', stock: '', status: 'active', image_url: '' });
        fetchProducts();
      })
      .catch(() => addToast("Xatolik yuz berdi", "error"))
      .finally(() => setSubmitting(false));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    axios.put(`/api/admin/products/${activeProduct.id}`, formData)
      .then(() => {
        addToast("Mahsulot yangilandi", "success");
        setShowEditModal(false);
        fetchProducts();
      })
      .catch(() => addToast("Xatolik yuz berdi", "error"))
      .finally(() => setSubmitting(false));
  };

  const handleDeleteConfirm = () => {
    setSubmitting(true);
    axios.delete(`/api/admin/products/${activeProduct.id}`)
      .then(() => {
        addToast("Mahsulot o'chirildi", "success");
        setShowDeleteModal(false);
        fetchProducts();
      })
      .catch(() => addToast("O'chirishda xatolik", "error"))
      .finally(() => setSubmitting(false));
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="view-container">
      <div className="view-header flex-between">
        <div>
          <h2 className="view-title">Products / Courses</h2>
          <p className="view-subtitle">Mahsulotlar katalogi, narxlar va zaxira boshqaruvi</p>
        </div>
        <Button variant="primary" icon="➕" onClick={() => {
          setFormData({ name: '', description: '', category: 'Programming', price: '', stock: '', status: 'active', image_url: '' });
          setFormErrors({});
          setShowAddModal(true);
        }}>
          Yangi Mahsulot
        </Button>
      </div>

      {/* Filter and Control Bar */}
      <div className="filter-card">
        <div className="filter-grid">
          <Input
            placeholder="Mahsulot nomi yoki tavsifi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon="🔍"
          />
          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            options={[
              { label: "Barcha Kategoriyalar", value: "" },
              { label: "Programming", value: "Programming" },
              { label: "Data Science", value: "Data Science" },
              { label: "Design", value: "Design" },
              { label: "Security", value: "Security" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { label: "Barcha Holatlar", value: "" },
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader text="Mahsulotlar yuklanmoqda..." />
      ) : paginatedProducts.length === 0 ? (
        <EmptyState title="Mahsulot topilmadi" description="Boshqa parametrlar bilan izlab ko'ring" />
      ) : (
        <>
          <div className="products-grid">
            {paginatedProducts.map(p => (
              <div key={p.id} className="product-card">
                <div className="product-image-box">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} />
                  ) : (
                    <div className="product-placeholder-img">📦</div>
                  )}
                  <Badge variant={p.status === 'active' ? 'success' : p.status === 'draft' ? 'warning' : 'secondary'} className="product-status-badge">
                    {p.status}
                  </Badge>
                </div>
                <div className="product-card-body">
                  <span className="product-category">{p.category}</span>
                  <h4 className="product-title">{p.name}</h4>
                  <p className="product-desc">{p.description || "Tavsif kiritilmagan"}</p>
                  <div className="product-meta-row">
                    <span className="product-stock">Zaxira: <strong>{p.stock} ta</strong></span>
                  </div>
                </div>
                <div className="product-card-footer">
                  <Button size="sm" variant="secondary" onClick={() => {
                    setActiveProduct(p);
                    setFormData({ name: p.name, description: p.description, category: p.category, price: p.price, stock: p.stock, status: p.status, image_url: p.image_url });
                    setFormErrors({});
                    setShowEditModal(true);
                  }}>
                    ✏️ Tahrirlash
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { setActiveProduct(p); setShowDeleteModal(true); }}>
                    🗑️ O'chirish
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yangi Mahsulot Qo'shish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button variant="primary" loading={submitting} onClick={handleAddSubmit}>Saqlash</Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <Input label="Mahsulot Nomi" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
          <Input label="Tavsif" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <Input label="Zaxira (Stock)" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} error={formErrors.stock} />
          <div className="form-grid-2">
            <Select label="Kategoriya" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} options={["Programming", "Data Science", "Design", "Security", "General"]} />
            <Select label="Holati" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={[{ label: "Active", value: "active" }, { label: "Draft", value: "draft" }, { label: "Archived", value: "archived" }]} />
          </div>
          <Input label="Rasm havolasi (URL)" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" />
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Mahsulotni Tahrirlash"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button variant="primary" loading={submitting} onClick={handleEditSubmit}>Saqlash</Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <Input label="Mahsulot Nomi" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={formErrors.name} />
          <Input label="Tavsif" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <Input label="Zaxira (Stock)" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} error={formErrors.stock} />
          <div className="form-grid-2">
            <Select label="Kategoriya" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} options={["Programming", "Data Science", "Design", "Security", "General"]} />
            <Select label="Holati" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={[{ label: "Active", value: "active" }, { label: "Draft", value: "draft" }, { label: "Archived", value: "archived" }]} />
          </div>
          <Input label="Rasm havolasi (URL)" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Mahsulotni O'chirish"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
            <Button variant="danger" loading={submitting} onClick={handleDeleteConfirm}>O'chirish</Button>
          </>
        }
      >
        <p><strong>{activeProduct?.name}</strong> mahsulotini o'chirmoqchimisiz?</p>
      </Modal>
    </div>
  );
}
