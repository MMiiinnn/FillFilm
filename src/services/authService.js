import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import toast from "react-hot-toast";

const authService = {
  /**
   * @param {string} email  
   * @param {string} password 
   * @param {string} displayName 
   * @returns {Promise<Object>} User object
   */
  signUp: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      toast.success(`Welcome, ${displayName || "User"}!`);
      return userCredential.user;
    } catch (error) {
      console.error("Sign up error:", error);
      
      // User-friendly error messages
      let errorMessage = "Failed to create account";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User object
   */
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      toast.success("Welcome back!");
      return userCredential.user;
    } catch (error) {
      console.error("Sign in error:", error);
      
      let errorMessage = "Failed to sign in";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      }
      
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * @returns {Promise<Object>} User object
   */
  signInWithGoogle: async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      toast.success(`Welcome, ${userCredential.user.displayName}!`);
      return userCredential.user;
    } catch (error) {
      console.error("Google sign in error:", error);
      
      let errorMessage = "Failed to sign in with Google";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign in cancelled";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups for this site";
      }
      
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * @returns {Promise<void>}
   */
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    }
  },

  /**
   * @param {string} email 
   * @returns {Promise<void>}
   */
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Password reset error:", error);
      
      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * @param {string} displayName 
   * @param {string} photoURL 
   * @returns {Promise<void>}
   */
  updateUserProfile: async (displayName, photoURL) => {
    try {
      const updates = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;

      await updateProfile(auth.currentUser, updates);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  },

  /**
   * @param {Function} callback 
   * @returns {Function} 
   */
  onAuthStateChanged: (callback) => {
    return firebaseOnAuthStateChanged(auth, callback);
  },

  /**
   * @returns {Object|null} 
   */
  getCurrentUser: () => {
    console.log(auth);
    return auth.currentUser;
  },
};

export default authService;
