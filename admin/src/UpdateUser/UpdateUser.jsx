import React, { useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import UserAPI from "../API/UserAPI";

const UpdateUser = () => {
  const { userId } = useParams();
  const history = useHistory();

  const fullnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const roleRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserAPI.getDetailData(userId);

        fullnameRef.current.value = response.fullname;
        emailRef.current.value = response.email;
        phoneRef.current.value = response.phone;
        roleRef.current.value = response.role;
      } catch (error) {
        console.error("Update failed!:", error);
        alert("User Not Found!");
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {
      userId: userId,
      fullname: fullnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      role: roleRef.current.value,
    };

    try {
      const response = await UserAPI.updateUser(data);
      alert(response.message || "Cập nhật người dùng thành công!");

      history.push("/users");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại, vui lòng kiểm tra lại kết nối.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Update User: {userId}</h4>
            <br />
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  ref={fullnameRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  ref={emailRef}
                  required
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  ref={phoneRef}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role (0: Customer, 1: Counselor, 2: Admin)</label>
                <input
                  type="number"
                  className="form-control"
                  ref={roleRef}
                  min="0"
                  max="2"
                  required
                />
              </div>
              <br />
              <button type="submit" className="btn btn-success">
                Update User
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => history.push("/users")}
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

export default UpdateUser;
