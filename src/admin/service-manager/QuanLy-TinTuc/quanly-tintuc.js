import React, { useEffect, useState } from "react";
import HeaderManager from "../header-manager/header-manager";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "./style.css";

Modal.setAppElement("#root"); // Thiết lập phần tử gốc cho modal

function QuanLyTinTuc() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  // const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    published_at: "",
  });
  const [showModal, setShowModal] = useState(false); // State để điều khiển việc hiển thị modal
  const [isEditing, setIsEditing] = useState(false); // State để kiểm tra xem có đang chỉnh sửa hay không
  const [currentArticleId, setCurrentArticleId] = useState(null); // State để lưu trữ ID của bài viết hiện tại

  useEffect(() => {
    // Hàm để gọi API và cập nhật state
    const fetchData = async () => {
      try {
        // Gọi API để lấy danh sách tin tức
        const response = await fetch(
          "http://localhost:88/api_travel/api/news.php"
        );
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : []);
        setNoResults(false); // Reset noResults khi có dữ liệu
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };

    fetchData();
  }, []); // Chạy một lần khi component được mount

  // const handleSearch = async (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   if (query.trim() === "") {
  //     // Nếu từ khóa tìm kiếm trống, lấy lại danh sách tin tức ban đầu
  //     const response = await fetch(
  //       "http://localhost/api-dulich-main/api-dulich/api/news.php"
  //     );
  //     const data = await response.json();
  //     setArticles(Array.isArray(data) ? data : []);
  //     setNoResults(false); // Reset noResults khi có dữ liệu
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://localhost:88/api_travel/api/admin/search_article.php?query=${query}`
  //     );
  //     if (response.status === 404) {
  //       setArticles([]);
  //       setNoResults(true);
  //     } else {
  //       const data = await response.json();
  //       setArticles(Array.isArray(data) ? data : []);
  //       setNoResults(data.length === 0); // Cập nhật noResults nếu không có kết quả
  //     }
  //   } catch (err) {
  //     console.error("Error searching data:", err);
  //     setError(err);
  //   }
  // };

  const deleteArticle = (articleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      fetch(
        "http://localhost:88/api_travel/api/admin/delete_article.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ article_id: articleId }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            setArticles(articles.filter((article) => article.id !== articleId));
            toast.success("Bài viết đã được xóa thành công");
          } else if (data.status === "error") {
            toast.error(data.message);
          } else {
            toast.error("Xóa bài viết thất bại. Vui lòng thử lại.");
          }
        })
        .catch((error) => {
          toast.error("Lỗi API.");
          console.error("Có lỗi xảy ra:", error);
        });
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleAddArticle = (e) => {
    e.preventDefault();
    fetch(
      "http://localhost:88/api_travel/api/admin/add_article.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setArticles([...articles, data.article]); // Cập nhật state articles
          toast.success("Bài viết đã được thêm thành công");
          setNewArticle({
            title: "",
            summary: "",
            content: "",
            image: "",
            published_at: "",
          });
          setShowModal(false); // Ẩn modal sau khi thêm thành công
        } else if (data.status === "error") {
          toast.error(data.message);
        } else {
          toast.error("Thêm bài viết thất bại. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        toast.error("Lỗi API.");
        console.error("Có lỗi xảy ra:", error);
      });
  };

  const handleEditArticle = (article) => {
    setNewArticle(article);
    setCurrentArticleId(article.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateArticle = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:88/api_travel/api/admin/update_article.php?id=${currentArticleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setArticles(
            articles.map((article) =>
              article.id === currentArticleId ? data.article : article
            )
          );
          toast.success("Bài viết đã được cập nhật thành công");
          setNewArticle({
            title: "",
            summary: "",
            content: "",
            image: "",
            published_at: "",
          });
          setShowModal(false); // Ẩn modal sau khi cập nhật thành công
          setIsEditing(false);
          setCurrentArticleId(null);
        } else if (data.status === "error") {
          toast.error(data.message);
        } else {
          toast.error("Cập nhật bài viết thất bại. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        toast.error("Lỗi API.");
        console.error("Có lỗi xảy ra:", error);
      });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setNewArticle({
      title: "",
      summary: "",
      content: "",
      image: "",
      published_at: new Date().toISOString().split("T")[0], // Đặt ngày hiện tại
    });
    setShowModal(true);
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <HeaderManager />

      <div
        className="container mx-auto sm:px-4 max-w-full -mt-[650px]"
        id="main-content"
      >
        <div className="flex flex-wrap ">
          <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
            <h3 className="mb-4 text-left font-semibold text-2xl ">
              QUẢN LÝ TIN TỨC
            </h3>
            <div className="relative flex flex-col h-[500px] min-w-0 rounded break-words bg-white border-1 border-gray-300 shadowc mb-12 overflow-y-auto">
              <div className="flex-auto p-4">
                {/* <div className="text-end mb-4">
                  <input
                    type="text"
                    className="block w-[20%] appearance-none  py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto"
                    placeholder="Type to search...."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div> */}
                <div className="text-end mb-4">
                  <button
                    onClick={openAddModal}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="block w-full overflow-auto scrolling-touch">
                  <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-center text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-100 h-9">
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col" className="summary">
                          Summary
                        </th>
                        <th scope="col">Published Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody id="articles-data">
                      {noResults ? (
                        <tr>
                          <td colSpan="5">Không tìm thấy bài viết nào.</td>
                        </tr>
                      ) : (
                        Array.isArray(articles) &&
                        articles.map(
                          (article) =>
                            article &&
                            article.id && (
                              <tr className="h-16 border-b-2" key={article.id}>
                                <td>{article.id}</td>
                                <td>{article.title}</td>
                                <td className="summary">{article.summary}</td>
                                <td>{formatDate(article.published_at)}</td>
                                <td>
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() => deleteArticle(article.id)}
                                      className="bg-[#dc3545] w-[30px] rounded-md py-1 font-semibold text-sm"
                                    >
                                      <i className="fa-solid fa-trash text-white"></i>
                                    </button>
                                    <button
                                      onClick={() => handleEditArticle(article)}
                                      className="bg-yellow-500 w-[30px] rounded-md py-1 font-semibold text-sm"
                                    >
                                      <i className="fa-solid fa-pen text-white"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <Modal
                  isOpen={showModal}
                  onRequestClose={() => setShowModal(false)}
                  contentLabel={
                    isEditing ? "Cập Nhật Tin Tức" : "Thêm Tin Tức Mới"
                  }
                  className="modal"
                  overlayClassName="modal-overlay"
                >
                  <h4 className="mb-2 text-left font-semibold text-xl">
                    {isEditing ? "Cập Nhật Tin Tức" : "Thêm Tin Tức Mới"}
                  </h4>
                  <form
                    onSubmit={
                      isEditing ? handleUpdateArticle : handleAddArticle
                    }
                  >
                    <div className="mb-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newArticle.title}
                        onChange={handleInputChange}
                        className="block w-full appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        name="summary"
                        placeholder="Summary"
                        value={newArticle.summary}
                        onChange={handleInputChange}
                        className="block w-full appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <textarea
                        name="content"
                        placeholder="Content"
                        value={newArticle.content}
                        onChange={handleInputChange}
                        className="block w-full appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={newArticle.image}
                        onChange={handleInputChange}
                        className="block w-full appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="date"
                        name="published_at"
                        value={newArticle.published_at}
                        onChange={handleInputChange}
                        className="block w-full appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        {isEditing ? "Cập Nhật" : "Thêm Tin Tức"}
                      </button>
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuanLyTinTuc;
