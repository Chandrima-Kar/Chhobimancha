// src/components/ShowModal.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "sonner";
import {
    handleImageFileDelete,
    handleImageFileUpload,
} from "../../utils/fileHandler";
import { MdDeleteForever } from "react-icons/md";

const APIURL = import.meta.env.VITE_API_URL;

const ShowModal = ({ show, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [poster, setPoster] = useState(null);
    const [language, setLanguage] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [posterFile, setPosterFile] = useState(null);
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [casts, setCasts] = useState([{ person: "", role: "" }]);
    const [crews, setCrews] = useState([{ person: "", role: "" }]);
    const [cineasts, setCineasts] = useState([]);
    const [uploadingPoster, setUploadingPoster] = useState("");
    const [deletingPoster, setDeletingPoster] = useState("");

    const fetchCineasts = async () => {
        try {
            const response = await axiosInstance.get(`${APIURL}/cineasts`);
            setCineasts(response.data);
        } catch (error) {
            console.error("Error fetching cineasts:", error);
        }
    };

    useEffect(() => {
        if (show) {
            setTitle(show.title);
            setDescription(show.description);
            setLanguage(show.language);
            setDate(show.date);
            setTime(show.time);
            setTicketPrice(show.ticketPrice);
            setTotalSeats(show.totalSeats);
            setSelectedTheatre(show.theatre || "");
            setCasts(show.casts);
            setCrews(show.crews);
        }
        fetchTheatres();
        fetchCineasts();
    }, [show]);

    const fetchTheatres = async () => {
        try {
            const response = await axiosInstance.get(`${APIURL}/theatres`);
            setTheatres(response.data);
        } catch (error) {
            console.error("Error fetching theatres:", error);
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleFileInputChange = (setter) => (e) => {
        setter(e.target.files[0]);
    };

    const handleArrayChange = (index, array, setArray) => (e) => {
        const { name, value } = e.target;
        const newArray = [...array];
        newArray[index][name] = value;
        setArray(newArray);
    };

    const addArrayItem = (setArray, array) => () => {
        setArray([...array, { person: "", role: "" }]);
    };

    const removeArrayItem = (index, array, setArray) => () => {
        const newArray = array.filter((_, i) => i !== index);
        setArray(newArray);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const showData = {
                title,
                description,
                poster,
                language,
                date,
                time,
                ticketPrice,
                totalSeats,
                theatre: selectedTheatre,
                casts,
                crews
            };

            if (show) {
                await axiosInstance.put(
                    `${APIURL}/shows/${show._id}`,
                    showData
                );
                toast.success("Show updated successfully!");
            } else {
                await axiosInstance.post(`${APIURL}/shows`, showData);
                toast.success("Show added successfully!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving show:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-[60%] h-[95%] max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {show ? "Edit Show" : "Add New Show"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="text"
                            value={title}
                            onChange={handleInputChange(setTitle)}
                        />
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Description
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border rounded"
                            value={description}
                            onChange={handleInputChange(setDescription)}
                        />
                    </div>
                    {/* Poster */}
                    {(!show || !show.poster) && (
                        <div className="flex flex-row justify-between">
                            <div className="mb-4">
                                <label className="block text-gray-700">
                                    Poster
                                </label>
                                <input
                                    className="w-full px-3 py-2 border rounded"
                                    type="file"
                                    onChange={handleFileInputChange(
                                        setPosterFile
                                    )}
                                />
                            </div>
                            {poster && (
                                <>
                                    <img
                                        src={poster}
                                        className="h-14 w-14 rounded-full"
                                    />
                                    <MdDeleteForever
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleImageFileDelete(
                                                poster.split("/").pop(),
                                                setPoster,
                                                setDeletingPoster
                                            )
                                        }
                                    />
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() =>
                                    handleImageFileUpload(
                                        setPoster,
                                        setPosterFile,
                                        setUploadingPoster,
                                        posterFile
                                    )
                                }>
                                {uploadingPoster ? (
                                    <u className="cursor-not-allowed">
                                        Uploading...
                                    </u>
                                ) : (
                                    <u className="cursor-pointer">Upload</u>
                                )}
                            </button>
                        </div>
                    )}
                    {/* Language */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Language</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="text"
                            value={language}
                            onChange={handleInputChange(setLanguage)}
                        />
                    </div>
                    {/* Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Date</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="date"
                            value={date}
                            onChange={handleInputChange(setDate)}
                        />
                    </div>
                    {/* Time */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Time</label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="time"
                            value={time}
                            onChange={handleInputChange(setTime)}
                        />
                    </div>
                    {/* Ticket Price */}
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Ticket Price
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="number"
                            value={ticketPrice}
                            onChange={handleInputChange(setTicketPrice)}
                        />
                    </div>
                    {/* Total Seats */}
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Total Seats
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded"
                            type="number"
                            value={totalSeats}
                            onChange={handleInputChange(setTotalSeats)}
                        />
                    </div>
                    {/* Theatre */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Theatre</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={selectedTheatre}
                            onChange={handleInputChange(setSelectedTheatre)}>
                            <option value="">Select a theatre</option>
                            {theatres.map((theatre) => (
                                <option key={theatre._id} value={theatre._id}>
                                    {theatre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Casts */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Casts</label>
                        {casts.map((cast, index) => (
                            <div key={index} className="flex mb-2">
                                <select
                                    name="person"
                                    value={cast.person}
                                    onChange={handleArrayChange(
                                        index,
                                        casts,
                                        setCasts
                                    )}
                                    className="w-full px-3 py-2 border rounded mr-2">
                                    <option value="">Select a cineast</option>
                                    {cineasts.map((cineast) => (
                                        <option
                                            key={cineast._id}
                                            value={cineast._id}>
                                            {cineast.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    name="role"
                                    value={cast.role}
                                    onChange={handleArrayChange(
                                        index,
                                        casts,
                                        setCasts
                                    )}
                                    className="w-full px-3 py-2 border rounded"
                                    type="text"
                                    placeholder="Role"
                                />
                                <button
                                    type="button"
                                    onClick={removeArrayItem(
                                        index,
                                        casts,
                                        setCasts
                                    )}
                                    className="ml-2 px-3 py-2 bg-red-500 text-white rounded">
                                    -
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addArrayItem(setCasts, casts)}
                            className="mt-2 px-3 py-2 bg-green-500 text-white rounded">
                            Add Cast
                        </button>
                    </div>
                    {/* Crews */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Crews</label>
                        {crews.map((crew, index) => (
                            <div key={index} className="flex mb-2">
                                <select
                                    name="person"
                                    value={crew.person}
                                    onChange={handleArrayChange(
                                        index,
                                        crews,
                                        setCrews
                                    )}
                                    className="w-full px-3 py-2 border rounded mr-2">
                                    <option value="">Select a cineast</option>
                                    {cineasts.map((cineast) => (
                                        <option
                                            key={cineast._id}
                                            value={cineast._id}>
                                            {cineast.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    name="role"
                                    value={crew.role}
                                    onChange={handleArrayChange(
                                        index,
                                        crews,
                                        setCrews
                                    )}
                                    className="w-full px-3 py-2 border rounded"
                                    type="text"
                                    placeholder="Role"
                                />
                                <button
                                    type="button"
                                    onClick={removeArrayItem(
                                        index,
                                        crews,
                                        setCrews
                                    )}
                                    className="ml-2 px-3 py-2 bg-red-500 text-white rounded">
                                    -
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addArrayItem(setCrews, crews)}
                            className="mt-2 px-3 py-2 bg-green-500 text-white rounded">
                            Add Crew
                        </button>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            onClick={onClose}
                            type="button">
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                            type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShowModal;