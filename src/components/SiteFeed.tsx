import { getLocations } from "@/lib/sites/helperFunctions";
import PaginationControls from "./PaginationControls";
import { SiteCard } from "./SiteCard";

export default async function SiteFeed({ start, perPage }: any) {
    const data = await getLocations(start, perPage)

    if (data.metadata === undefined) {

        return <div>loading...</div>;
    }

    const paginationControls = {
        state: {
            perPage: perPage,
            currentPage: start,
        },
        data:
            data.metadata
    }
    return (
        <div className="flex flex-col justify-center text-gray-600">
            <PaginationControls
                metadata={paginationControls}
            />
            {data.data.map((location) => (
                <SiteCard key={location.id} props={location} />
            ))}
        </div>
    );
}