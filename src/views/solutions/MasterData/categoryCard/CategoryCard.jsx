import React, { useState, useEffect } from "react";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MASTER_DATA } from "store/constant";
import axios from "axios";
import useCategoryCard from "hooks/useCategoryCard";

const CategoryCard = () => {
  const [categoryCardSelected, setCategoryCardSelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [spendPatternData, setSpendPatternData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { categoryCard } = useCategoryCard();

  const [categoryStates, setCategoryStates] = useState(categoryCard?.status || {});

  useEffect(() => {
    if (categoryCard && categoryCard.length > 0) {
      const initialStates = {};
      categoryCard.forEach(card => {
        initialStates[card.category_card_id] = card.status;
      });
      setCategoryStates(initialStates);
    }
  }, [categoryCard]);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setCategoryCardSelected(true);

    try {
      const [categoryCardDataResponse] = await Promise.all([
        axios.get(`${MASTER_DATA}/categoryCard/categoryCardData/${category?.category_card_id}`)
      ]);
      setSpendPatternData(categoryCardDataResponse?.data?.spend_patterns);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      toast.error("Failed to fetch data");
    }
  };

  const handleClose = () => {
    setCategoryCardSelected(false);
    setSelectedCategory(null);
  };

  const handleAddCategories = async (newCategories) => {
    const categoriesWithId = newCategories.map(category => {
      const formattedSubcategoryName = category.subcategory_name.replace(/\s+/g, '_');
      return {
        ...category,
        category_card_id: `CCD_${category.subcategory_id}_${formattedSubcategoryName}_${category.country}`,
        status: false
      };
    });

    setCategories(prevCategories => [...prevCategories, ...categoriesWithId]);

    categoriesWithId.forEach(category => {
      toast.success(`Category Card ID is created: ${category.category_card_id}`);
    });

    try {
      for (const category of categoriesWithId) {
        console.log(category);
        const apiCategory = {
          parent_category_id: category.parent_category_id,
          parent_category_name: category.parent_category_name,
          description: category.description,
          category_level: parseInt(category.category_level), 
          unspsc_code: category.unspsc_code,
          sub_categories: category.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
            description: sub.description, 
          })),
          category_owner: category.category_owner,
          country: category.country,
        };

        console.log(apiCategory);
        const response = await axios.post(
          `${MASTER_DATA}/categoryCard/register_category`,
          apiCategory
        );
        console.log("Category registered successfully:", response.data);
      }
    } catch (error) {
      console.error("Error registering categories:", error);
      toast.error("Failed to register categories. Please try again.");
    }
  };

  const handleStatusChange = async (categoryCardId, newStatus) => {
    try {
      setCategoryStates(prev => ({ ...prev, [categoryCardId]: newStatus }));
      
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.category_card_id === categoryCardId ? { ...cat, status: newStatus } : cat
        )
      );

      if (selectedCategory && selectedCategory.category_card_id === categoryCardId) {
        setSelectedCategory(prev => ({ ...prev, status: newStatus }));
      }

      await axios.patch(`${MASTER_DATA}/categoryCard/toggleCategoryCardActivation/${categoryCardId}?status=${newStatus}`);

      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update category status");

      setCategoryStates(prev => ({ ...prev, [categoryCardId]: !newStatus }));
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.category_card_id === categoryCardId ? { ...cat, status: !newStatus } : cat
        )
      );
      if (selectedCategory && selectedCategory.category_card_id === categoryCardId) {
        setSelectedCategory(prev => ({ ...prev, status: !newStatus }));
      }
    }
  };
  

  return (
    <div>
      {!categoryCardSelected ? (
        <FirstPage
          onCategorySelect={handleCategorySelect}
          onAddCategories={handleAddCategories}
          categories={categories}
          setCategories={setCategories}
          handleStatusChange={handleStatusChange}
          categoryStates={categoryStates}
        />
      ) : (
        <SecondPage
          category={selectedCategory}
          onClose={handleClose}
          handleStatusChange={handleStatusChange}
          categoryCardId={selectedCategory?.category_card_id}
          categoryStates={categoryStates} 
          spendPatternData={spendPatternData}
          loading={loading}
          error={error}
          categoryName={selectedCategory?.category_name
          }

        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CategoryCard;