// src/components/ShowAdminCard.jsx
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ShowAdminCard = ({ show, onEditClick, onDeleteClick }) => {
    return (
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img
                src={show.poster}
                alt={show.title}
                className="w-full h-64 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-bold mb-2 text-center">{show.title}</h2>
            <p className="text-gray-700 mb-2 text-center">
                Description: {show.description}
            </p>
            <p className="text-gray-700 mb-2 text-center">
                Date: {new Date(show.date).toLocaleDateString()}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
                <button
                    className="bg-yellow-500 text-white p-2 rounded"
                    onClick={() => onEditClick(show)}>
                    <FaEdit />
                </button>
                <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => onDeleteClick(show._id)}>
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default ShowAdminCard;