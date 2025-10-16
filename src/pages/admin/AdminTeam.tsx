import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Edit, Trash2, Users, Linkedin, Upload } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedin: string;
  order?: number;
}

interface FormData {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

const AdminTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    image: '',
    linkedin: ''
  });

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const q = query(collection(db, 'teamMembers'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.role.trim() || !formData.image.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate LinkedIn URL format if provided
    if (formData.linkedin && !formData.linkedin.startsWith('http')) {
      toast.error('LinkedIn URL must be a valid URL starting with http:// or https://');
      return;
    }

    try {
      if (editingId) {
        // Update existing member
        await updateDoc(doc(db, 'teamMembers', editingId), {
          name: formData.name.trim(),
          role: formData.role.trim(),
          image: formData.image.trim(),
          linkedin: formData.linkedin.trim() || '#',
          updatedAt: new Date().toISOString()
        });
        toast.success('Team member updated successfully');
      } else {
        // Add new member
        await addDoc(collection(db, 'teamMembers'), {
          name: formData.name.trim(),
          role: formData.role.trim(),
          image: formData.image.trim(),
          linkedin: formData.linkedin.trim() || '#',
          order: teamMembers.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success('Team member added successfully');
      }

      // Reset form and refresh list
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  // Handle edit
  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      image: member.image,
      linkedin: member.linkedin
    });
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'teamMembers', id));
      toast.success('Team member deleted successfully');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', role: '', image: '', linkedin: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Team Management">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Team Management">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Team Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage team members displayed on the About Us page
          </p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </CardTitle>
            <CardDescription>
              {editingId ? 'Update team member information' : 'Add a new team member to your About Us page'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Founder & CEO"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    type="url"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to hide LinkedIn link</p>
              </div>

              <div>
                <Label>Profile Image *</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    {uploading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                  </div>
                  
                  {formData.image && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Image uploaded successfully</p>
                        <p className="text-xs text-gray-500 mt-1 break-all">{formData.image}</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Recommended: Square image (1:1 aspect ratio), at least 400x400px, max 5MB
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" disabled={uploading || !formData.image}>
                  {editingId ? 'Update' : 'Add'} Team Member
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 text-center">
                No team members yet. Click "Add Team Member" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                {member.linkedin && member.linkedin !== '#' && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mb-3"
                  >
                    <Linkedin className="h-3 w-3" />
                    View LinkedIn
                  </a>
                )}
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      {teamMembers.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-600">{teamMembers.length}</span> team member{teamMembers.length !== 1 ? 's' : ''} displayed on the About Us page
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
