import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Product } from '@/models/Product';

interface FormData {
  name: string;
  price: string;
  stock: string;
  category: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
}

interface ProductFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Product;
  mode: 'create' | 'edit';
}

const EMPTY_FORM: FormData = { name: '', price: '', stock: '', category: '' };

const validate = (form: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório';
  }
  const price = parseFloat(form.price.replace(',', '.'));
  if (!form.price.trim() || isNaN(price) || price <= 0) {
    errors.price = 'Preço deve ser maior que zero';
  }
  const stock = parseInt(form.stock, 10);
  if (!form.stock.trim() || isNaN(stock) || stock < 0) {
    errors.stock = 'Estoque deve ser 0 ou mais';
  }
  return errors;
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && initialData) {
      setForm({
        name: initialData.name,
        price: initialData.price.toString().replace('.', ','),
        stock: initialData.stock.toString(),
        category: initialData.category ?? '',
      });
    } else if (visible) {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [visible]);

  const setField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setSaving(true);
      await onSubmit({
        name: form.name.trim(),
        price: parseFloat(form.price.replace(',', '.')),
        stock: parseInt(form.stock, 10),
        category: form.category.trim() || undefined,
      });
      onClose();
    } catch {
      // erro exposto via viewModel.error — modal permanece aberto
    } finally {
      setSaving(false);
    }
  };

  const title = mode === 'edit' ? 'Editar Produto' : 'Novo Produto';
  const submitLabel = mode === 'edit' ? 'Salvar' : 'Criar';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 justify-end">

          {/* Backdrop */}
          <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

          {/* Card */}
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8 gap-4">

            {/* Header */}
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-extrabold text-gray-900">{title}</Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-sm font-bold text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Campo: Nome */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-gray-700">Nome:</Text>
              <TextInput
                value={form.name}
                onChangeText={v => setField('name', v)}
                placeholder="Ex: Arroz"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                className={`border rounded-xl px-3 py-2.5 text-sm text-gray-900 ${
                  errors.name ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <Text className="text-xs text-red-500">{errors.name}</Text>
              )}
            </View>

            {/* Linha: Preço + Estoque */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold text-gray-700">Preço:</Text>
                <TextInput
                  value={form.price}
                  onChangeText={v => setField('price', v)}
                  placeholder="Ex: 10,00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                  className={`border rounded-xl px-3 py-2.5 text-sm text-gray-900 ${
                    errors.price ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.price && (
                  <Text className="text-xs text-red-500">{errors.price}</Text>
                )}
              </View>

              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold text-gray-700">Estoque:</Text>
                <TextInput
                  value={form.stock}
                  onChangeText={v => setField('stock', v)}
                  placeholder="Ex: 10"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  className={`border rounded-xl px-3 py-2.5 text-sm text-gray-900 ${
                    errors.stock ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.stock && (
                  <Text className="text-xs text-red-500">{errors.stock}</Text>
                )}
              </View>
            </View>

            {/* Campo: Categoria */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-gray-700">
                Categoria <Text className="font-normal text-gray-400">(Opcional):</Text>
              </Text>
              <TextInput
                value={form.category}
                onChangeText={v => setField('category', v)}
                placeholder="Ex: Laticínios"
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
              />
            </View>

            {/* Botão submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={saving}
              className="bg-[#FF8C3A] rounded-xl py-3 items-center"
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-sm font-bold">{submitLabel}</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
