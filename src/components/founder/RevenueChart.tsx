
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { RevenueChartData } from '@/types/founder';

interface RevenueChartProps {
  data: RevenueChartData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução da Receita</CardTitle>
        <CardDescription>
          MRR e ARR ao longo dos últimos meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString('pt-BR')}`,
                  name === 'mrr' ? 'MRR' : 'ARR'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="mrr" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="MRR"
              />
              <Line 
                type="monotone" 
                dataKey="arr" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="ARR"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
