import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../Components/Auth/Auth";
import { profileAPI } from "../../Utility/axios";
import { Button, Spinner, Alert } from "react-bootstrap";
import { FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileAPI.getProfile();
      setProfile(res.data);
      setForm({
        firstname: res.data.firstname || "",
        lastname: res.data.lastname || "",
        email: res.data.email || "",
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await profileAPI.updateProfile(form);
      setMessage("Profile updated successfully!");
      setEdit(false);
      setProfile((prev) => ({ ...prev, ...form }));
      updateUser(form);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    // Compress image before converting to base64
    const compressImage = (file) => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions (max 300x300)
          const maxSize = 300;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          resolve(compressedDataUrl);
        };
        
        img.src = URL.createObjectURL(file);
      });
    };

    try {
      const compressedBase64 = await compressImage(file);
      
      await profileAPI.updateProfilePicture(compressedBase64);
      setProfile((prev) => ({ ...prev, profile_pic: compressedBase64 }));
      setMessage("Profile picture updated successfully!");
      updateUser({ profile_pic: compressedBase64 });
    } catch (err) {
      setError("Failed to update profile picture");
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="appContainer">
      <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
        <h2 className={styles.profileTitle}>Profile</h2>

        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <div className={styles.profilePictureSection}>
          <div className={styles.profilePictureContainer}>
            <img
              src={
                profile?.profile_pic ||
                "https://via.placeholder.com/150x150?text=Profile"
              }
              alt="Profile"
              className={styles.profilePicture}
            />
            <button
              className={styles.cameraButton}
              onClick={handlePictureClick}
              title="Change profile picture"
            >
              <FaCamera />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {edit ? (
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={profile?.username || ""}
                disabled
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.buttonGroup}>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className={styles.saveButton}
              >
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEdit(false);
                  setForm({
                    firstname: profile?.firstname || "",
                    lastname: profile?.lastname || "",
                    email: profile?.email || "",
                  });
                }}
                className={styles.cancelButton}
              >
                <FaTimes /> Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.profileInfo}>
            <div className={styles.infoGroup}>
              <label>Username</label>
              <p>{profile?.username}</p>
            </div>

            <div className={styles.infoGroup}>
              <label>First Name</label>
              <p>{profile?.firstname}</p>
            </div>

            <div className={styles.infoGroup}>
              <label>Last Name</label>
              <p>{profile?.lastname}</p>
            </div>

            <div className={styles.infoGroup}>
              <label>Email</label>
              <p>{profile?.email}</p>
            </div>

            <Button
              variant="primary"
              onClick={() => setEdit(true)}
              className={styles.editButton}
            >
              <FaEdit /> Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 