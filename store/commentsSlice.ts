import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
  id: string;
  text: string;
  userName: string;
  avatarUrl?: string;
}

interface CommentsState {
  [packageId: string]: Comment[];
}

const initialState: CommentsState = {};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<{ packageId: string; comments: Comment[] }>) => {
      state[action.payload.packageId] = action.payload.comments;
    },
    addComment: (state, action: PayloadAction<Comment & { packageId: string }>) => {
      if (!state[action.payload.packageId]) state[action.payload.packageId] = [];
      state[action.payload.packageId].unshift(action.payload); // يظهر أول تعليق
    },
    editComment: (state, action: PayloadAction<{ packageId: string; commentId: string; text: string }>) => {
      const comments = state[action.payload.packageId];
      if (!comments) return;
      const index = comments.findIndex(c => c.id === action.payload.commentId);
      if (index !== -1) comments[index].text = action.payload.text;
    },
    deleteComment: (state, action: PayloadAction<{ packageId: string; commentId: string }>) => {
      const comments = state[action.payload.packageId];
      if (!comments) return;
      state[action.payload.packageId] = comments.filter(c => c.id !== action.payload.commentId);
    },
  },
});

export const { setComments, addComment, editComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;
