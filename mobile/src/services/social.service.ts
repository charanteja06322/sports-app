/**
 * Social Service
 * Handle social features (posts, likes, comments) with Supabase
 */
import { supabase } from '../config/supabase';

export interface Post {
  id: string;
  user_id: string;
  match_id?: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

class SocialService {
  /**
   * Create a new post
   */
  async createPost(content: string, matchId?: string, imageUrl?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          match_id: matchId,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create post');
    }
  }

  /**
   * Get all posts (feed)
   */
  async getFeed(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          ),
          match:match_id (
            id,
            team1:team1_id (name),
            team2:team2_id (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch feed');
    }
  }

  /**
   * Get user's posts
   */
  async getUserPosts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          ),
          match:match_id (
            id,
            team1:team1_id (name),
            team2:team2_id (name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user posts');
    }
  }

  /**
   * Get post by ID
   */
  async getPostById(postId: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          ),
          match:match_id (
            id,
            team1:team1_id (name),
            team2:team2_id (name)
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch post');
    }
  }

  /**
   * Like a post
   */
  async likePost(postId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert like
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (likeError) throw likeError;

      // Increment likes count
      const { error: updateError } = await supabase.rpc('increment_likes', {
        post_id: postId,
      });

      if (updateError) {
        // Fallback: manually update
        const { data: post } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();

        await supabase
          .from('posts')
          .update({ likes_count: (post?.likes_count || 0) + 1 })
          .eq('id', postId);
      }

      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to like post');
    }
  }

  /**
   * Unlike a post
   */
  async unlikePost(postId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete like
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (unlikeError) throw unlikeError;

      // Decrement likes count
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      await supabase
        .from('posts')
        .update({ likes_count: Math.max((post?.likes_count || 1) - 1, 0) })
        .eq('id', postId);

      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to unlike post');
    }
  }

  /**
   * Check if user liked a post
   */
  async hasLikedPost(postId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (error) return false;
      return !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Add comment to post
   */
  async addComment(postId: string, content: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert comment
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Increment comments count
      const { data: post } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      await supabase
        .from('posts')
        .update({ comments_count: (post?.comments_count || 0) + 1 })
        .eq('id', postId);

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add comment');
    }
  }

  /**
   * Get post comments
   */
  async getPostComments(postId: string) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch comments');
    }
  }

  /**
   * Delete post
   */
  async deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete post');
    }
  }

  /**
   * Update post
   */
  async updatePost(postId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update post');
    }
  }
}

export const socialService = new SocialService();
