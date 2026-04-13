import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ProductAPI from "../API/ProductAPI";

const UpdateProduct = () => {
  const { productId } = useParams();
  const history = useHistory();

  const [product, setProduct] = useState(null);

  // Khởi tạo Refs
  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();
  const countRef = useRef();
  const shortDescRef = useRef();
  const longDescRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductAPI.getDetail(productId);
        setProduct(response);

        nameRef.current.value = response.name;
        categoryRef.current.value = response.category;
        priceRef.current.value = response.price;
        countRef.current.value = response.count;
        shortDescRef.current.value = response.short_desc;
        longDescRef.current.value = response.long_desc;
      } catch (error) {
        console.error("Lỗi khi tải thông tin sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {
      name: nameRef.current.value,
      category: categoryRef.current.value,
      price: priceRef.current.value,
      count: countRef.current.value,
      short_desc: shortDescRef.current.value,
      long_desc: longDescRef.current.value,
    };

    try {
      const response = await ProductAPI.putUpdate(productId, data);
      alert(response.message || "Cập nhật sản phẩm thành công!");
      history.push("/products");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại, vui lòng kiểm tra lại logic Server.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update Product: {productId}</h4>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  ref={nameRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  className="form-control"
                  ref={categoryRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  ref={priceRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Inventory Count</label>
                <input
                  type="number"
                  className="form-control"
                  ref={countRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  ref={shortDescRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Long Description</label>
                <textarea
                  className="form-control"
                  rows="6"
                  ref={longDescRef}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Update Product
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => history.push("/products")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
