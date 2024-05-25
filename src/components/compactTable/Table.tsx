import React from 'react';
import CopyToClipboard from '../CopyToClipboard';
import ConciliateWithSFButton from '../conciliateWithSFButton/ConciliateWithSFButton';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import ChangeHouseStatusDropdown from '../ChangeHouseStatusDropdown';


interface House {
    id: number;
    streetNumber: number;
    street: {
        name: string;
    };
    name: string;
    lastName: string;
    lastUpdated: Date;
    lastUpdatedBy: string;
    internalNotes: string;
    type: string;
    phone: string;
    email: string;
    statusAttempt: string;
    isConcilatedInSalesForce: boolean;
    consent: string;
    location: string;
}

interface TableProps {
    data: House[];
}

const Table: React.FC<TableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <TableHeader
                    columns={[
                        'Address',
                        'Last Name',
                        'Name',
                        'Phone',
                        'Email',
                        'Type',
                        'Status Attempt',
                        // 'Consent',
                        'Last Update',
                        'Internal Notes',
                    ]}
                />
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-gray-200">
                            <TableCell className='font-semibold flex justify-between items-center' text={`${row.streetNumber} ${row.street.name}`}>
                                <ConciliateWithSFButton houseId={row.id.toString()} status={row.isConcilatedInSalesForce} />
                            </TableCell>
                            <TableCell text={row.lastName} />
                            <TableCell text={row.name} />
                            <TableCell text={row.phone} />
                            <TableCell text={row.email} />
                            <TableCell clipboard={false} text={row.type} />
                            <TableCell
                                className='py-0 px-0'
                                clipboard={false}
                                text='None' >
                                <ChangeHouseStatusDropdown
                                    houseId={row.id.toString()}
                                    statusAttempt={row.statusAttempt}
                                />
                            </TableCell>
                            {/* <TableCell
                                clipboard={false}
                                text={row.consent}
                            /> */}
                            <TableCell
                                className="px-3 py-2 border border-gray-300 text-center"
                                text={row.lastUpdatedBy.substring(0, 9)}
                                clipboard={false}
                            >                                
                                <div className="flex justify-center ">
                                    <span>{format(new Date(row.lastUpdated), 'MMM dd, HH:mm')}</span>
                                </div>
                            </TableCell>
                            <TableCell clipboard={false} text={row.internalNotes} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function TableHeader({ columns }: { columns: string[] }) {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column} className="px-2 py-1 border border-gray-200">
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
}


interface TableCellProps {
    text?: string | null | undefined;
    className?: string;
    clipboard?: boolean;
    children?: React.ReactNode;
}

function TableCell({ text, className, clipboard = true, children }: TableCellProps) {
    let displayText = '';

    if (text === 'None' && !clipboard) {
        displayText = '';
    } else {
        displayText = text || 'N/A';
    }

    return (
        <td className={cn('px-3 py-2 border border-gray-300', className)}>
            {displayText ? (
                <div className="flex items-center justify-between p-1">
                    <span>{displayText}</span>
                    {clipboard && displayText !== 'N/A' && <CopyToClipboard text={displayText} />}
                </div>
            ) : (
                <span className="text-gray-400">{displayText}</span>
            )}
            {children}
        </td>
    );
}



export default Table;