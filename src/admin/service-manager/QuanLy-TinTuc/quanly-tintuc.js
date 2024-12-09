import React, { useEffect, useState } from "react";
import HeaderManager from "../header-manager/header-manager";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import "./style.css";
import config from "../../../component/config.json";

const { SERVER_API } = config;

Modal.setAppElement("#root");

function QuanLyTinTuc() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    published_at: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${SERVER_API}/news.php`
        );
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };

    fetchData();
  }, []);

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

  const handleAddArticle = async (e) => {
    e.preventDefault();
    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await fetch(
          `${SERVER_API}/upload_image1.php`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          imageUrl = data.path;
        } else {
          toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
          return;
        }
      } catch (error) {
        toast.error("Lỗi API khi tải ảnh lên.");
        console.error("Có lỗi xảy ra:", error);
        return;
      }
    }

    fetch(
      `${SERVER_API}/admin/add_article.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newArticle, image: imageUrl }),
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
          setArticles([...articles, data.article]);
          toast.success("Bài viết đã được thêm thành công");
          setNewArticle({
            title: "",
            summary: "",
            content: "",
            image: "",
            published_at: "",
          });
          setShowModal(false);
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
    // Chuyển đổi định dạng ngày từ yyyy-MM-dd HH:mm:ss sang yyyy-MM-dd
    const formattedDate = article.published_at.split(" ")[0];
    setNewArticle({ ...article, published_at: formattedDate });
    setCurrentArticleId(article.id);
    setIsEditing(true);
    setShowModal(true);
  };
  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    let imageUrl = newArticle.image;
  
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
  
      try {
        const response = await fetch(
          `${SERVER_API}/upload_image1.php`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          imageUrl = data.path;
        } else {
          toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
          return;
        }
      } catch (error) {
        toast.error("Lỗi API khi tải ảnh lên.");
        console.error("Có lỗi xảy ra:", error);
        return;
      }
    }
  
    const updatedArticle = {
      ...newArticle,
      image: imageUrl,
    };
  
    console.log("Dữ liệu gửi lên API:", updatedArticle);
  
    fetch(
      `${SERVER_API}/admin/update_article.php?article_id=${currentArticleId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedArticle),
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
              article.id === currentArticleId
                ? { ...article, ...updatedArticle }
                : article
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
          setShowModal(false);
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
      published_at: new Date().toISOString().split("T")[0], // Định dạng yyyy-MM-dd
    });
    setShowModal(true);
  };

  const onDrop = (acceptedFiles) => {
    setImageFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
                        <th scope="col">Mã</th>
                        <th scope="col">Tiêu đề</th>
                        <th scope="col" className="summary">
                          Tóm tắt
                        </th>
                        <th scope="col">Ngày đăng</th>
                        <th scope="col">Tùy chọn</th>
                      </tr>
                    </thead>
                    <tbody id="articles-data">
                      {Array.isArray(articles) &&
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
                      <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        {imageFile ? (
                          <p>{imageFile.name}</p>
                        ) : (
                          <p>Kéo và thả ảnh vào đây, hoặc nhấp để chọn ảnh</p>
                        )}
                      </div>
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