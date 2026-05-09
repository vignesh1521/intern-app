"use client";

import Button from "@/components/Button";

import { jwtDecode } from "jwt-decode";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { apiFetch } from "../lib/api";

type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
};

type DecodedToken = {
    userId: number;
    name: string;
    email: string;
    role: "admin" | "user";
};

export default function DashboardPage() {
    const router = useRouter();

    const [role, setRole] =
        useState<"admin" | "user">("user");

    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [editId, setEditId] =
        useState<number | null>(null);

    const [editTitle, setEditTitle] =
        useState("");

    const [editDescription,
        setEditDescription] = useState("");

    const [editPrice, setEditPrice] =
        useState("");

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [newTitle, setNewTitle] =
        useState("");

    const [newDescription,
        setNewDescription] = useState("");

    const [newPrice, setNewPrice] =
        useState("");

    const [createLoading,
        setCreateLoading] = useState(false);

    const [updateLoading,
        setUpdateLoading] = useState(false);

    const [deleteLoading,
        setDeleteLoading] =
        useState<number | null>(null);

    const openEditModal = (
        product: Product
    ) => {
        setEditId(product.id);

        setEditTitle(product.title);

        setEditDescription(
            product.description
        );

        setEditPrice(
            product.price.toString()
        );

        setShowEditModal(true);
    };

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decoded: DecodedToken =
                jwtDecode(token);

            setRole(decoded.role);

        } catch (error) {
            console.log(error);

            localStorage.removeItem(
                "token"
            );

            router.push("/login");
        }

        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const req =
                await apiFetch(
                    "/api/products"
                );

            const data =
                await req.json();

            if (data.success) {
                setProducts(
                    data.products
                );
            }

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(
            "token"
        );

        router.push("/login");
    };

    const handleDelete = async (
        id: number
    ) => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        setDeleteLoading(id);

        try {
            const req =
                await apiFetch(
                    `/api/products/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await req.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product.id !== id
                )
            );

        } catch (error) {
            console.log(error);

        } finally {
            setDeleteLoading(null);
        }
    };

    const handleUpdate = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setUpdateLoading(true);

        try {
            const req =
                await apiFetch(
                    `/api/products/${editId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            title: editTitle,
                            description:
                                editDescription,
                            price: editPrice,
                        }),
                    }
                );

            const data =
                await req.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setProducts((prev) =>
                prev.map((product) =>
                    product.id === editId
                        ? {
                            ...product,
                            title: editTitle,
                            description:
                                editDescription,
                            price: Number(
                                editPrice
                            ),
                        }
                        : product
                )
            );

            setShowEditModal(false);

        } catch (error) {
            console.log(error);

        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCreate = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setCreateLoading(true);

        try {
            const req =
                await apiFetch(
                    "/api/products",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            title: newTitle,
                            description:
                                newDescription,
                            price: newPrice,
                        }),
                    }
                );

            const data =
                await req.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setProducts((prev) => [
                data.product,
                ...prev,
            ]);

            setNewTitle("");

            setNewDescription("");

            setNewPrice("");

            setShowAddModal(false);

        } catch (error) {
            console.log(error);

        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Dashboard
                        </h1>

                        <p className="text-gray-600 mt-1">
                            Welcome back
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {role === "admin" && (
                            <Button
                                onClick={() =>
                                    setShowAddModal(true)
                                }
                            >
                                Add Product
                            </Button>
                        )}

                        <Button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Logout
                        </Button>

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                    <div className="bg-white p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            Total Products
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {products.length}
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            User Role
                        </h2>

                        <p className="text-3xl font-bold mt-2 capitalize">
                            {role}
                        </p>

                    </div>

                </div>

                <div>

                    <h2 className="text-2xl font-bold mb-5">
                        Products
                    </h2>

                    {loading ? (
                        <div className="bg-white rounded-2xl shadow p-10 text-center">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
                            No products found
                        </div>

                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {products.map(
                                (product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white p-5 rounded-2xl shadow"
                                    >

                                        <h3 className="text-xl font-semibold">
                                            {product.title}
                                        </h3>

                                        <p className="text-gray-600 mt-2">
                                            {
                                                product.description
                                            }
                                        </p>

                                        <p className="text-lg font-bold mt-4">
                                            ₹{product.price}
                                        </p>

                                        {role === "admin" && (
                                            <div className="flex gap-3 mt-5">

                                                <Button
                                                    onClick={() =>
                                                        openEditModal(
                                                            product
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-sm"
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id
                                                        )
                                                    }
                                                    loading={
                                                        deleteLoading ===
                                                        product.id
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-sm"
                                                >
                                                    Delete
                                                </Button>

                                            </div>
                                        )}
                                    </div>
                                )
                            )}

                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-2xl font-bold">
                                Edit Product
                            </h2>

                            <button
                                onClick={() =>
                                    setShowEditModal(false)
                                }
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="space-y-4"
                        >

                            <input
                                type="text"
                                placeholder="Product title"
                                value={editTitle}
                                onChange={(e) =>
                                    setEditTitle(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={
                                    editDescription
                                }
                                onChange={(e) =>
                                    setEditDescription(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={editPrice}
                                onChange={(e) =>
                                    setEditPrice(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />

                            <Button
                                type="submit"
                                loading={
                                    updateLoading
                                }
                                fullWidth
                            >
                                Update Product
                            </Button>

                        </form>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-2xl font-bold">
                                Add Product
                            </h2>

                            <button
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={handleCreate}
                            className="space-y-4"
                        >

                            <input
                                type="text"
                                placeholder="Product title"
                                value={newTitle}
                                onChange={(e) =>
                                    setNewTitle(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={
                                    newDescription
                                }
                                onChange={(e) =>
                                    setNewDescription(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={newPrice}
                                onChange={(e) =>
                                    setNewPrice(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                required
                            />

                            <Button
                                type="submit"
                                loading={
                                    createLoading
                                }
                                fullWidth
                            >
                                Create Product
                            </Button>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}