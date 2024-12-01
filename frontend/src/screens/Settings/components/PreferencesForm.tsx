import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { SelectButton } from '../../../components/common/SelectButton';
import { usePreferences } from '../../../hooks/usePreferences';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Section = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const OptionsContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const TagInput = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TagsContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const Tag = styled(View)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  flex-direction: row;
  align-items: center;
`;

const TagText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;

const learningStyles = [
  { label: 'Visual', value: 'visual' },
  { label: 'Auditory', value: 'auditory' },
  { label: 'Reading', value: 'reading' },
  { label: 'Kinesthetic', value: 'kinesthetic' }
];

const communicationStyles = [
  { label: 'Formal', value: 'formal' },
  { label: 'Casual', value: 'casual' },
  { label: 'Direct', value: 'direct' },
  { label: 'Supportive', value: 'supportive' }
];

export const PreferencesForm = () => {
  const { preferences, updatePreferences, isLoading } = usePreferences();
  const [newInterest, setNewInterest] = useState('');
  const [newFocusArea, setNewFocusArea] = useState('');

  const [formData, setFormData] = useState({
    learningStyle: preferences?.learningStyle || '',
    communicationStyle: preferences?.communicationStyle || '',
    interests: preferences?.interests || [],
    focusAreas: preferences?.focusAreas || []
  });

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleAddFocusArea = () => {
    if (newFocusArea.trim()) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()]
      }));
      setNewFocusArea('');
    }
  };

  const handleRemoveTag = (type: 'interests' | 'focusAreas', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      await updatePreferences(formData);
      Alert.alert('Success', 'Preferences updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences');
    }
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Learning Style</SectionTitle>
        <OptionsContainer>
          {learningStyles.map(style => (
            <SelectButton
              key={style.value}
              label={style.label}
              selected={formData.learningStyle === style.value}
              onPress={() => setFormData(prev => ({ ...prev, learningStyle: style.value }))}
            />
          ))}
        </OptionsContainer>

        <SectionTitle>Communication Style</SectionTitle>
        <OptionsContainer>
          {communicationStyles.map(style => (
            <SelectButton
              key={style.value}
              label={style.label}
              selected={formData.communicationStyle === style.value}
              onPress={() => setFormData(prev => ({ ...prev, communicationStyle: style.value }))}
            />
          ))}
        </OptionsContainer>

        <SectionTitle>Interests</SectionTitle>
        <TagInput>
          <Input
            value={newInterest}
            onChangeText={setNewInterest}
            placeholder="Add an interest"
            onSubmitEditing={handleAddInterest}
          />
        </TagInput>
        <TagsContainer>
          {formData.interests.map((interest, index) => (
            <Tag key={index}>
              <TagText>{interest}</TagText>
              <Button
                title="×"
                onPress={() => handleRemoveTag('interests', index)}
                variant="text"
              />
            </Tag>
          ))}
        </TagsContainer>

        <SectionTitle>Focus Areas</SectionTitle>
        <TagInput>
          <Input
            value={newFocusArea}
            onChangeText={setNewFocusArea}
            placeholder="Add a focus area"
            onSubmitEditing={handleAddFocusArea}
          />
        </TagInput>
        <TagsContainer>
          {formData.focusAreas.map((area, index) => (
            <Tag key={index}>
              <TagText>{area}</TagText>
              <Button
                title="×"
                onPress={() => handleRemoveTag('focusAreas', index)}
                variant="text"
              />
            </Tag>
          ))}
        </TagsContainer>

        <Button
          title="Save Preferences"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
        />
      </Section>
    </Container>
  );
};