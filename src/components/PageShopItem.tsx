import { useErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { ShopItemResource } from "../Resources";
import { getShopItem } from "../backend/shopperapi";
import React from "react";
import LoadingIndicator from "./LoadingIndicator";
import { Card } from "react-bootstrap";

export default function PageShopItem() {
    const { showBoundary } = useErrorBoundary();
    const params = useParams();
    const shopItemID = params.shopitemID!;
    const [shopItem, setShopItem] = React.useState<ShopItemResource | null>();
    async function loadShopItem() {
        try {
            const shopItem: ShopItemResource = await getShopItem(shopItemID);
            setShopItem(shopItem);
        } catch (error) {
            setShopItem(null);
            showBoundary(error)
        }
    }

    React.useEffect(() => {
        loadShopItem();
    }, []);


    if (!shopItem) {
        return <LoadingIndicator />;
    }
    return (
        <div key={shopItemID}>
            <Card style={{ width: '13rem' }}>
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                    <Card.Title>{shopItem.name} by {shopItem.creatorName}</Card.Title>
                    <Card.Text>
                        Quantity is {shopItem.quantity}.
                        Created at {shopItem.createdAt} with 
                        {shopItem.remarks? shopItem.remarks : " no remarks"}
                    </Card.Text>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                </Card.Body>
            </Card>
        </div>
    );

}