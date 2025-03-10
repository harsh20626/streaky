import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trophy, Star, Users, MessageSquare, Search, 
  Camera, Image, ArrowLeft, Heart, Reply, Share, 
  User as UserIcon, Lock, Upload, Send, FileImage, Flame 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  createdAt: string;
  likes: string[];
  comments: CommunityComment[];
  isPrivate: boolean;
}

interface CommunityComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("public");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [newPostPrivate, setNewPostPrivate] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [privatePosts, setPrivatePosts] = useState<CommunityPost[]>([]);
  
  useEffect(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    const savedPrivatePosts = localStorage.getItem('privateCommunityPosts');
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    
    if (savedPrivatePosts) {
      setPrivatePosts(JSON.parse(savedPrivatePosts));
    }
  }, []);
  
  const goBackToHome = () => {
    navigate("/");
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPostImage(e.target.files[0]);
      setShowImagePreview(true);
    }
  };
  
  const handlePostSubmit = () => {
    if (!user) {
      toast.error("You must be logged in to post");
      return;
    }
    
    if (!newPostContent.trim()) {
      toast.error("Post cannot be empty");
      return;
    }
    
    const imageUrl = newPostImage ? URL.createObjectURL(newPostImage) : undefined;
    
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.photoUrl,
      content: newPostContent,
      images: imageUrl ? [imageUrl] : undefined,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      isPrivate: newPostPrivate
    };
    
    if (newPostPrivate) {
      const updatedPrivatePosts = [newPost, ...privatePosts];
      setPrivatePosts(updatedPrivatePosts);
      localStorage.setItem('privateCommunityPosts', JSON.stringify(updatedPrivatePosts));
    } else {
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    }
    
    setNewPostContent("");
    setNewPostImage(null);
    setShowImagePreview(false);
    setNewPostPrivate(false);
    
    toast.success("Post published successfully");
  };
  
  const handleLikePost = (postId: string, isPrivate: boolean) => {
    if (!user) return;
    
    if (isPrivate) {
      const updatedPosts = privatePosts.map(post => {
        if (post.id === postId) {
          const userLiked = post.likes.includes(user.id);
          const updatedLikes = userLiked 
            ? post.likes.filter(id => id !== user.id) 
            : [...post.likes, user.id];
          
          return { ...post, likes: updatedLikes };
        }
        return post;
      });
      
      setPrivatePosts(updatedPosts);
      localStorage.setItem('privateCommunityPosts', JSON.stringify(updatedPosts));
    } else {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const userLiked = post.likes.includes(user.id);
          const updatedLikes = userLiked 
            ? post.likes.filter(id => id !== user.id) 
            : [...post.likes, user.id];
          
          return { ...post, likes: updatedLikes };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    }
  };
  
  const addComment = (postId: string, comment: string, isPrivate: boolean) => {
    if (!user || !comment.trim()) return;
    
    const newComment: CommunityComment = {
      id: `comment-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.photoUrl,
      content: comment,
      createdAt: new Date().toISOString()
    };
    
    if (isPrivate) {
      const updatedPosts = privatePosts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      });
      
      setPrivatePosts(updatedPosts);
      localStorage.setItem('privateCommunityPosts', JSON.stringify(updatedPosts));
    } else {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    }
  };
  
  const PostCard = ({ post, isPrivate }: { post: CommunityPost, isPrivate: boolean }) => {
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);
    
    const handleCommentSubmit = () => {
      if (commentText.trim()) {
        addComment(post.id, commentText, isPrivate);
        setCommentText("");
      }
    };
    
    const formattedDate = new Date(post.createdAt).toLocaleString();
    const isLiked = user ? post.likes.includes(user.id) : false;
    
    return (
      <Card className="bg-todo-gray/50 backdrop-blur-sm border border-purple-500/10 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <UserAvatar name={post.userName} src={post.userAvatar} />
              <div>
                <CardTitle className="text-base text-white">{post.userName}</CardTitle>
                <CardDescription className="text-xs text-purple-300/70">{formattedDate}</CardDescription>
              </div>
            </div>
            {isPrivate && (
              <Badge variant="outline" className="bg-purple-900/20 text-purple-300">
                <Lock className="h-3 w-3 mr-1" /> Private
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 whitespace-pre-wrap mb-4">{post.content}</p>
          
          {post.images && post.images.length > 0 && (
            <div className="rounded-md overflow-hidden my-3 border border-purple-500/20">
              <img 
                src={post.images[0]} 
                alt="Post attachment" 
                className="w-full object-cover max-h-80"
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-1.5 ${isLiked ? 'text-pink-500' : 'text-purple-300/70'}`}
              onClick={() => handleLikePost(post.id, isPrivate)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-pink-500' : ''}`} />
              <span>{post.likes.length}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-purple-300/70"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-1.5 text-purple-300/70">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardContent>
        
        {showComments && (
          <CardFooter className="flex flex-col pt-0 pb-4">
            <div className="w-full mb-3">
              {post.comments.length > 0 ? (
                <div className="space-y-3 pt-3 border-t border-purple-500/10 w-full">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <UserAvatar 
                        name={comment.userName} 
                        src={comment.userAvatar} 
                        size="sm"
                      />
                      <div className="flex-1 bg-todo-gray/70 p-2 rounded-md">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-white">{comment.userName}</p>
                          <span className="text-xs text-purple-300/50">
                            {new Date(comment.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-purple-300/50 py-2">No comments yet</p>
              )}
            </div>
            
            <div className="flex w-full items-center gap-2">
              <UserAvatar name={user?.name || "Guest"} src={user?.photoUrl} size="sm" />
              <Input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="bg-todo-gray/80"
              />
              <Button 
                size="icon"
                className="bg-todo-purple hover:bg-todo-purple/90"
                onClick={handleCommentSubmit}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="container py-6">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-1.5 text-purple-300"
          onClick={goBackToHome}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Join the Community</CardTitle>
            <CardDescription className="text-purple-300/70">
              Log in to connect with other Streaky users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              className="bg-todo-purple hover:bg-todo-purple/90"
              onClick={() => navigate("/auth")}
            >
              Log In to Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1.5 text-purple-300"
          onClick={goBackToHome}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gradient-primary text-center flex-1">Community Hub</h1>
        
        <div className="w-[94px]"></div> {/* For balance */}
      </div>
      
      <Tabs defaultValue="public" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-todo-gray/80 backdrop-blur-sm border border-purple-500/10">
          <TabsTrigger 
            value="public" 
            className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300"
          >
            <Users className="h-4 w-4 mr-2" />
            Public
          </TabsTrigger>
          <TabsTrigger 
            value="private" 
            className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300"
          >
            <Lock className="h-4 w-4 mr-2" />
            Private
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard" 
            className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="public" className="focus-visible:outline-none">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/4 space-y-6">
              <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Share with Community</CardTitle>
                  <CardDescription className="text-purple-300/70">Post your achievements, ask questions, or share tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="What's on your mind?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="resize-none min-h-[100px]"
                    />
                    
                    {showImagePreview && newPostImage && (
                      <div className="relative rounded-md overflow-hidden border border-purple-500/20">
                        <img 
                          src={URL.createObjectURL(newPostImage)} 
                          alt="Post preview" 
                          className="w-full object-cover max-h-60"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setNewPostImage(null);
                            setShowImagePreview(false);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => document.getElementById('postImage')?.click()}
                        >
                          <Image className="h-4 w-4" />
                          <span>Image</span>
                        </Button>
                        <input 
                          type="file" 
                          id="postImage" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden" 
                        />
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1.5"
                            >
                              <UserIcon className="h-4 w-4" />
                              <span>Visibility</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-todo-gray border-purple-500/20">
                            <DropdownMenuItem 
                              onClick={() => setNewPostPrivate(false)}
                              className={!newPostPrivate ? "bg-purple-900/30" : ""}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              <span>Public</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setNewPostPrivate(true)}
                              className={newPostPrivate ? "bg-purple-900/30" : ""}
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              <span>Private</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <Button 
                        className="bg-todo-purple hover:bg-todo-purple/90"
                        onClick={handlePostSubmit}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map(post => (
                    <PostCard key={post.id} post={post} isPrivate={false} />
                  ))
                ) : (
                  <Card className="bg-todo-gray/50 backdrop-blur-sm border border-purple-500/10 p-8 text-center">
                    <p className="text-purple-300/70">No public posts yet. Be the first to share!</p>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-1/4 space-y-6">
              <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gradient-primary flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-400" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user?.name || ""} src={user?.photoUrl} />
                        <span className="font-medium text-white">{user?.name}</span>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    {posts.slice(0, 3).map((post, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={post.userName} src={post.userAvatar} />
                          <span className="font-medium text-white">{post.userName}</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gradient-primary flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• Be kind and respectful to others</li>
                    <li>• Share your achievements and progress</li>
                    <li>• Ask for help when needed</li>
                    <li>• Offer support to fellow users</li>
                    <li>• Keep private content in the appropriate section</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="private" className="focus-visible:outline-none">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/4 space-y-6">
              <Card className="bg-gradient-to-br from-todo-purple/20 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Private Community</CardTitle>
                  <CardDescription className="text-purple-300/70">
                    A special space for introverts. Your posts here are only visible to you and selected trusted members.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Share your daily picture or progress privately..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="resize-none min-h-[100px]"
                    />
                    
                    {showImagePreview && newPostImage && (
                      <div className="relative rounded-md overflow-hidden border border-purple-500/20">
                        <img 
                          src={URL.createObjectURL(newPostImage)} 
                          alt="Post preview" 
                          className="w-full object-cover max-h-60"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setNewPostImage(null);
                            setShowImagePreview(false);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => document.getElementById('privatePostImage')?.click()}
                        >
                          <Camera className="h-4 w-4" />
                          <span>Photo</span>
                        </Button>
                        <input 
                          type="file" 
                          id="privatePostImage" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden" 
                        />
                      </div>
                      
                      <Button 
                        className="bg-todo-purple hover:bg-todo-purple/90"
                        onClick={() => {
                          setNewPostPrivate(true);
                          handlePostSubmit();
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Post Privately
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                {privatePosts.length > 0 ? (
                  privatePosts.map(post => (
                    <PostCard key={post.id} post={post} isPrivate={true} />
                  ))
                ) : (
                  <Card className="bg-todo-gray/50 backdrop-blur-sm border border-purple-500/10 p-8 text-center">
                    <p className="text-purple-300/70">No private posts yet. This space is just for you!</p>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-1/4 space-y-6">
              <Card className="bg-gradient-to-br from-todo-purple/20 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gradient-primary flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-purple-300" />
                    Private Space
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-4">
                    This private community is designed for introverts to track their progress
                    in a safe, judgment-free zone.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2 bg-todo-gray/30 p-3 rounded-md border border-purple-500/10">
                      <h3 className="text-sm font-medium text-white">Daily Photo Challenge</h3>
                      <p className="text-xs text-purple-300/70">
                        Upload a daily photo to track your progress over time.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 mt-1"
                        onClick={() => document.getElementById('privatePostImage')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Today's Photo</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-todo-purple/20 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-gradient-primary flex items-center">
                    <FileImage className="h-5 w-5 mr-2 text-purple-300" />
                    Your Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-3">
                    Track your progress over time with your private photo journal.
                  </p>
                  
                  {privatePosts.filter(post => post.images && post.images.length > 0).length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {privatePosts
                        .filter(post => post.images && post.images.length > 0)
                        .slice(0, 4)
                        .map((post, index) => (
                          <div key={index} className="aspect-square rounded-md overflow-hidden border border-purple-500/20">
                            <img 
                              src={post.images![0]} 
                              alt={`Journey day ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-purple-300/50 p-4">
                      No images yet. Start your journey today!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
              <CardHeader>
                <CardTitle className="text-gradient-primary flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Community Leaderboard
                </CardTitle>
                <CardDescription className="text-purple-300/70">Top contributors and streak maintainers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((rank) => {
                    const isCurrentUser = rank === 1;
                    
                    return (
                      <div 
                        key={rank} 
                        className={`flex items-center justify-between p-3 rounded-md ${
                          isCurrentUser ? 'bg-amber-500/10 border border-amber-500/30' : 'border-b border-purple-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`
                            font-bold text-lg w-8 text-center
                            ${rank === 1 ? 'text-yellow-400' : 
                              rank === 2 ? 'text-gray-400' : 
                              rank === 3 ? 'text-amber-700' : 'text-purple-300/70'}
                          `}>
                            {rank}
                          </span>
                          
                          <UserAvatar 
                            name={isCurrentUser ? user.name : `User ${rank}`} 
                            src={isCurrentUser ? user.photoUrl : undefined} 
                          />
                          
                          <div>
                            <p className="font-medium text-white">
                              {isCurrentUser ? user.name : `Community Member ${rank}`}
                            </p>
                            <p className="text-xs text-purple-300/70">
                              {isCurrentUser ? 'You' : `Active since ${new Date().toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-white">{Math.floor(Math.random() * 40) + 10}</span>
                            <span className="text-xs text-purple-300/70">streak days</span>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-white">{Math.floor(Math.random() * 100) + 50}</span>
                            <span className="text-xs text-purple-300/70">points</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button 
                  variant="outline" 
                  className="bg-todo-gray/50"
                >
                  See Full Leaderboard
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-todo-gray/30 rounded-md">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <span className="text-white">Your Rank</span>
                      </div>
                      <span className="font-bold text-lg text-white">#1</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-todo-gray/30 rounded-md">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="text-white">Current Streak</span>
                      </div>
                      <span className="font-bold text-lg text-white">5 days</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-todo-gray/30 rounded-md">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-purple-400" />
                        <span className="text-white">Total Points</span>
                      </div>
                      <span className="font-bold text-lg text-white">120</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-gradient-primary">Weekly Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-todo-purple/10 border border-todo-purple/30 rounded-md">
                    <h3 className="font-medium text-white mb-2">Consistency Master</h3>
                    <p className="text-sm text-purple-300/70 mb-3">
                      Complete your tasks for 7 days in a row
                    </p>
                    <div className="h-2 bg-todo-gray/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-todo-purple" 
                        style={{ width: '71%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-purple-300/70">5/7 days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
