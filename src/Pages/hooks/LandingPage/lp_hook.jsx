// src/hooks/useLandingPageData.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

// Import from your new, organized service files
import {
  fetchUserDetails,
  fetchUserSkinType,
} from "../../../service/landingpage/user";
import { fetchRecentProducts } from "../../../service/landingpage/product";
import {
  fetchRecentKeyProblems,
  fetchRecentFaceAnalytics,
  fetchRecentSkinScore,
  fetchRecentBodyImpurities,
} from "../../../service/landingpage/skinanalysis";

export const useLandingPageData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }
        const userId = user.id;

        const [
          userDetails,
          skinType,
          recentProducts,
          faceKeyProblems,
          faceAnalytics,
          faceScore,
          bodyKeyProblems,
          bodyScore,
          bodyImpurities,
        ] = await Promise.all([
          fetchUserDetails(userId),
          fetchUserSkinType(userId),
          fetchRecentProducts(userId, 3),
          fetchRecentKeyProblems(userId, "face"),
          fetchRecentFaceAnalytics(userId),
          fetchRecentSkinScore(userId, "face"),
          fetchRecentKeyProblems(userId, "body"),
          fetchRecentSkinScore(userId, "body"),
          fetchRecentBodyImpurities(userId, 3),
        ]);

        setData({
          firstName: userDetails?.first_name || "User",
          skinType,
          recentProducts,
          faceKeyProblems,
          faceAnalytics,
          faceScore,
          bodyKeyProblems,
          bodyScore,
          bodyImpurities,
        });
      } catch (err) {
        console.error("Failed to fetch landing page data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return { data, loading, error };
};
