import { ShopListResource } from "../Resources";

export default function ShopListDescription(props: {
    shopList: ShopListResource
}) {

    const shopList = props.shopList;
    return (
        <tr key={shopList.id}>
            <td>{shopList.store}</td>
            <td>{shopList.creatorName}</td>
            <td>{shopList.createdAt}</td>
            <td>{shopList.public ? "yes" : "no"}</td>
            <td>{shopList.done ? "yes" : "no"}</td>
            <td>{shopList.shopItemCount}</td>
        </tr>
    );
}   