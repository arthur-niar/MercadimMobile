import { supabase } from '../config/supabase';
import { Report } from '../types';

export async function createReport(userId: string, reportData: Omit<Report, 'id'>): Promise<Report | null> {
    const { data: existingReport, error: fetchError } = await supabase
        .from('relatorio')
        .select('*')
        .eq('idusuario', parseInt(userId))
        .maybeSingle();

    if (fetchError) {
        throw new Error('Error checking existing report');
    }

    if (existingReport) {
        return null;
    }

    const { data: insertedReport, error } = await supabase
        .from('relatorio')
        .insert({
            idusuario: parseInt(userId),
            nomeProduto: reportData.nomeProduto,
            lucroTotal: reportData.lucroTotal,
            vendasTotais: reportData.vendasTotais,
            vendasSemanais: reportData.vendasSemanais,
            aumentoEstoque: reportData.aumentoEstoque
        })
        .select('*')
        .single();

    if (error) {
        throw new Error('Error creating report');
    }

    return insertedReport as Report;
}

export async function getReport(userId: string): Promise<Report | null> {
    const { data: reportData, error } = await supabase
        .from('relatorio')
        .select('*')
        .eq('idusuario', parseInt(userId))
        .single();

    if (error) {
        throw new Error('Error fetching report');
    }
    return reportData as Report | null;
}


