import React, { useRef } from "react";
import ProductAPI from "../API/ProductAPI";

const NewProduct = () => {
  const nameRef = useRef();
  const categoryRef = useRef();
  const shortDescRef = useRef();
  const longDescRef = useRef();
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const images = fileInputRef.current.files;

    if (images.length !== 5) {
      alert("Vui lòng upload chính xác **5** hình ảnh!");
      return;
    }

    // Đóng gói dữ liệu bằng FormData
    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("category", categoryRef.current.value);
    formData.append("short_desc", shortDescRef.current.value);
    formData.append("long_desc", longDescRef.current.value);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const response = await ProductAPI.postCreate(formData);
      alert("Thêm sản phẩm thành công!");

      e.target.reset();
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      alert("Đã có lỗi xảy ra, vui lòng kiểm tra lại cấu trúc dữ liệu.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            style={{ width: "50%", marginLeft: "40px" }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Product Name"
                ref={nameRef}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Category"
                ref={categoryRef}
                required
              />
            </div>
            <div class="form-group">
              <label>Short Description</label>
              <textarea
                class="form-control"
                rows="3"
                placeholder="Enter Short Description"
                ref={shortDescRef}
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>Long Description</label>
              <textarea
                class="form-control"
                rows="6"
                placeholder="Enter Long Description"
                ref={longDescRef}
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="fileUpload">Upload image (5 images)</label>
              <input
                type="file"
                class="form-control-file"
                id="fileUpload"
                multiple
                ref={fileInputRef}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
