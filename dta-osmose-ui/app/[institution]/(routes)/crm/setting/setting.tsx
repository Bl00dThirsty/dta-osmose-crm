"use client"

// SettingsForm.tsx
import React, { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/state/api';
import { useParams } from "next/navigation"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AppSettingForm {
    company_name: string;
    tag_line: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    footer: string;
  }

export default function SettingsForm() {
  const { institution } = useParams<{ institution: string }>();
  //console.log('Institution from params:', institution);
  const { data: settings, isLoading, isError } = useGetSettingsQuery({ institution });
  //console.log('Settings data:', settings);
  const [updateSettings] = useUpdateSettingsMutation();
  
  const [formData, setFormData] = useState<AppSettingForm>({
    company_name: '',
    tag_line: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    footer: ''
  });

  // Mettre à jour le state quand les settings sont chargés
  useEffect(() => {
    if (Array.isArray(settings) && settings.length > 0) {
      const setting = settings[0]; // 👈 prends le premier (ou adapte si tu en as plusieurs)
      setFormData({
        company_name: setting.company_name || '',
        tag_line: setting.tag_line || '',
        address: setting.address || '',
        phone: setting.phone || '',
        email: setting.email || '',
        website: setting.website || '',
        footer: setting.footer || ''
      });
    }
  }, [settings]);
  const settingId = Array.isArray(settings) && settings.length > 0 ? settings[0].id : null;
  if (!settingId) return;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    try {
      await updateSettings({
        id: settingId,
        data: formData
      }).unwrap();
      alert('Paramètres mis à jour avec succès!');
    } catch (error) {
      alert('Erreur lors de la mise à jour des paramètres');
    }
  };

  if (isLoading || !formData.company_name) return <div>Chargement...</div>;
  if (isError) return <div>Vous n'avez pas accès à ces informations. Erreur lors du chargement des paramètres</div>;
  if (!settings) return <div>Aucun paramètre trouvé pour cette institution.</div>;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company_name" className='mb-3'>Nom de l'entreprise👈</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="tag_line" className='mb-3'>Slogan</Label>
              <Input
                id="tag_line"
                name="tag_line"
                value={formData.tag_line}
                onChange={handleChange}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="address" className='mb-3'>Adresse</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className='mb-3'>Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="email" className='mb-3'>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="website" className='mb-3'>Site web</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="footer" className='mb-3'>Texte de pied de page</Label>
              <Input
                id="footer"
                name="footer"
                value={formData.footer}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" variant="default">
              Modifier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
