'use client'
import { getActiveLocations, getAllHousesInLocationSeeding, getAllLocationsDropDown } from "@/app/actions/actions";
import { useEffect, useState } from "react";
// import { House } from "@prisma/client";
import { LocationDropdown } from "../houseTable/columns/forSeeding";
import  Table  from "./Table";

interface LogEntry {
    name: string | null;
    lastName: string | null;
    type: string | null;
    statusAttempt: string | null;
    consent: string | null;
    email: string | null;
    // externalNotes: string | null;
    // internalNotes: string | null;
    phone: string | null;
    timeStamp: Date;
    userName: string | null;
}


interface House {
    id: number;
    streetNumber: number;
    street: {
        name: string;
    };
    name: string;
    lastName: string;
    type: string;
    phone: string;
    email: string;
    isConcilatedInSalesForce: boolean;
    statusAttempt: string;
    consent: string;
    location: string;
    internalNotes: string;
    lastUpdatedBy: string;
    lastUpdated: Date;
    houseHistory: LogEntry[];
}

export default function CompactTable() {
    const [data, setData] = useState<House[]>([]);
    const [locations, setLocations] = useState<LocationDropdown>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>("");
    const [selectedLocationName, setSelectLocationName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(100); // Rows per page
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // Rows per page
    const [initialCsvData, setInitialCsvData] = useState<House[]>([]);

    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const fetchedLocations = await getActiveLocations();
                // Check if fetchedLocations is an array and set locations
                if (Array.isArray(fetchedLocations)) {
                    setLocations(fetchedLocations);
                } else {
                    // If fetchedLocations is not an array, handle it as an error
                    setFetchError(fetchedLocations.error);
                }
            } catch (error) {
                const errorMessage = error?.toString() || "Error fetching locations";
                console.error("Error fetching locations:", error);
                setFetchError(errorMessage);
            }
        };

        fetchLocations();
    }, []);

    // Step 5: Handle location selection change
    const handleLocationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedLocationId(event.target.value);
        // Find the location object from the locations array
        const selectedLocation = locations.find(location => location.id.toString() === event.target.value);

        // Set the selectedLocationName state to the found location's name
        // If the selected location is found, update the name, otherwise set it to an empty string
        setSelectLocationName(selectedLocation ? selectedLocation.name : "");
    };

    // Fetch data with pagination
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const skip = page * rowsPerPage;
                const take = rowsPerPage;
                if (selectedLocationId) {
                    const result = await getAllHousesInLocationSeeding(
                        selectedLocationId,
                        skip,
                        take
                    );
                    if (result && result.data) {
                        const response = result.data;
                        
                        setData(response);
                        setTotalRecords(result.metadata.totalRecords);
                        setTotalPages(result.metadata.totalPages);
                        setInitialCsvData(result.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching houses:", error);
                // Handle error appropriately
            }
            setLoading(false);
        };

        fetchData();
    }, [selectedLocationId, page, rowsPerPage]);

    const getPageRange = (current: number, total: number) => {
        const range = 3; // Number of pages to show before and after the current page
        const start = Math.max(2, current - range);
        const end = Math.min(total - 1, current + range);

        const pages = [];
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < total - 1) pages.push("...");

        return pages;
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    const handlePageChange = (newPage: any) => {
        setPage(Math.max(0, Math.min(newPage, totalPages - 1))); // Ensure newPage is within range
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <label className="mr-2">Select Location:</label>
                    <select
                        value={selectedLocationId}
                        onChange={handleLocationChange}
                        className="border border-gray-300 rounded-md p-1"
                    >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Pagination and Rows per Page Selection */}
                <div className="flex flex-wrap justify-between items-center mb-4 p-2 gap-2 bg-slate-200 ">
                    <div className="flex items-center space-x-2">
                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(0)}
                            disabled={page === 0}
                        >
                            First Page
                        </button>

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                        >
                            Previous
                        </button>

                        {getPageRange(page, totalPages).map((p, index) => (
                            <button
                                key={index}
                                className={`bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border ${page === p ? "border-blue-700" : "border-blue-500"
                                    } rounded hover:border-transparent disabled:opacity-50`}
                                onClick={() => handlePageChange(typeof p === "number" ? p : page)}
                                disabled={typeof p !== "number"}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page + 1 >= totalPages}
                        >
                            Next
                        </button>

                        <button
                            className="bg-gray-100 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 text-sm border border-blue-500 rounded hover:border-transparent disabled:opacity-50"
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={page + 1 >= totalPages}
                        >
                            Last Page
                        </button>

                        <div className="flex gap-2 items-center">
                            <label className="block text-sm font-bold text-gray-700">
                                Rows per page:
                                <select
                                    className="ml-2 p-1 rounded border border-gray-300 focus:outline-none"
                                    value={rowsPerPage}
                                    onChange={handleChangeRowsPerPage}
                                >
                                    {[100, 150, 250, 500].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {/* <button
                                className="bg-gray-100 hover:bg-green-400 text-green-700 font-semibold hover:text-white py-1 px-3 text-sm border border-green-500 rounded hover:border-transparent disabled:opacity-50"
                                onClick={() => downloadCSV(selectedLocationName)} // Pass selectedLocationName to downloadCSV function
                            >
                                Download {selectedLocationName}.csv
                            </button> */}

                        </div>
                    </div>
                </div>
                {/* <div>
                    <button className="btn btn-primary">Export CSV</button>
                </div> */}
            </div>
            <div className="overflow-x-auto">
                <Table
                    data={data}
                />

            </div>
        </div>
    );
}
    