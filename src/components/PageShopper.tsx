import React, { useContext } from "react";
import { ShopperResource } from "../Resources";
import { useErrorBoundary } from "react-error-boundary";
import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom";
import { getShopper } from "../backend/shopperapi";
import Table from 'react-bootstrap/Table';
import '../styles/PageShopper.css';
import { useLoginContext } from "../LoginContext";

export default function PageShopper() {
    const {loginInfo} = useLoginContext();
    const [shopper, setShopper] = React.useState<ShopperResource | null>();
    const { showBoundary } = useErrorBoundary();
    async function loadShopper() {
        try {
            const shopLists: ShopperResource = await getShopper();
            setShopper(shopLists);
        } catch (error) {
            setShopper(null);
            showBoundary(error)
        }
    }

    React.useEffect(() => {
        loadShopper();
    }, [loginInfo]);

    if (!shopper) {
        return <LoadingIndicator />;
    }
    else {
        let shopLists = shopper.shopLists.map((sl) => (
            <tr key={sl.id}>
                <td>{sl.store}</td>
                <td>{sl.creatorName}</td>
                <td>{sl.createdAt}</td>
                <td>{sl.public ? "yes" : "no"}</td>
                <td>{sl.done ? "yes" : "no"}</td>
                <td>{sl.shopItemCount}</td>
                <Link to={`/shoplist/${sl.id}`} className="view-link">View Shoplist</Link>
            </tr>

        ));
        return (
            <>
            <h1>Shoplists</h1>
                <Table className="shopper-table" hover striped>
                    <thead>
                        <tr>
                            <th>Store</th>
                            <th>Creator</th>
                            <th>Created</th>
                            <th>Public</th>
                            <th>Done</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopLists}
                    </tbody>
                </Table>
            </>
        );
    }
}


