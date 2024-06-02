import React, { useState } from 'react';
import { MenuItem, FormControl, InputLabel, Select, Button, Box, TextField, CircularProgress, IconButton, Modal } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, editCategory, deleteCategory } from '../store/reducers/categoriesSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function CategorySelect({ value, onChange, className }) {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryTitle, setEditedCategoryTitle] = useState('');

  const toggleAddCategory = () => {
    setAddingCategory(!addingCategory);
    setNewCategory('');
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== '') {
      setIsLoading(true); 
      const categoryData = { title: newCategory.trim() };
      const result = await dispatch(addCategory(categoryData));
      if (result.payload) {
        onChange({ target: { name: 'category_id', value: result.payload.id } });
      }
      setNewCategory('');
      setAddingCategory(false);
      setIsLoading(false); 
    }
  };

  const handleEditCategory = (categoryId, title) => {
    setEditingCategory(categoryId);
    setEditedCategoryTitle(title);
    setIsModalOpen(true);
  };

  const handleEditCategoryTitle = async () => {
    if (editedCategoryTitle.trim() !== '') {
      await dispatch(editCategory({ id: editingCategory, updatedCategory: { title: editedCategoryTitle.trim() } }));
      setEditingCategory(null);
      setEditedCategoryTitle('');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    dispatch(deleteCategory(categoryId));
    if (value === categoryId) {
      onChange({ target: { name: 'category_id', value: '' } });
    }
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setEditedCategoryTitle('');
    setIsModalOpen(false);
  };

  return (
    <FormControl variant="outlined" fullWidth className={className}>
      <InputLabel id="transaction-category-label" className={`${addingCategory ? '!hidden' : ''}`}>Категория</InputLabel>
      {addingCategory && (
        <Box className="flex space-x-4">
          <TextField
            label="Новая категория"
            variant="outlined"
            name="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className='bg-white'
            fullWidth
          />
          <Button
            onClick={handleAddCategory}
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Добавить'}
          </Button>
          <Button onClick={toggleAddCategory} variant="contained" color="secondary">
            Отмена
          </Button>
        </Box>
      )}
      <div className='flex gap-2'>
        <Select
          labelId="transaction-category-label"
          label="Категория"
          name="category_id"
          value={value}
          onChange={onChange}
          className={`${addingCategory ? '!hidden' : 'bg-white flex-1'}`}
          required
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category.id}>{category.title}</MenuItem>
          ))}
          <MenuItem value="" onClick={toggleAddCategory}>
            + Добавить категорию
          </MenuItem>
        </Select>
        
        <IconButton onClick={() => setIsModalOpen(true)} className={`${addingCategory ? '!hidden' : '!my-2 !px-2'}`}>
          <MoreVertIcon />
        </IconButton>
      </div>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className='bg-white w-[400px] h-[500px] rounded-2xl p-5 !m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <h2 className='font-bold text-xl mb-4'>Категории</h2>
          <div className='flex flex-col gap-1 h-[410px] overflow-y-auto pr-2'>
            {categories.map((category, index) => (
              <div key={index} className='shadow-md p-2 flex justify-between items-center rounded-xl'>
                {editingCategory === category.id ? (
                  <>
                    <input
                      value={editedCategoryTitle}
                      onChange={(e) => setEditedCategoryTitle(e.target.value)}
                      className='bg-white flex-1 outline-none'
                      autoFocus
                    />
                    <div className='flex gap-2'>
                      <IconButton aria-label="edit" className='size-8' onClick={() => handleEditCategoryTitle()}>
                        <CheckIcon color='success' />
                      </IconButton>
                      <IconButton aria-label="edit" className='size-8' onClick={handleCloseModal}>
                        <CloseIcon color='error' />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{category.title}</span>
                    <div className='flex gap-2'>
                      <IconButton aria-label="edit" className='size-8' onClick={() => handleEditCategory(category.id, category.title)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" color='error' className='size-8' onClick={() => handleDeleteCategory(category.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </FormControl>
  );
}

export default CategorySelect;
