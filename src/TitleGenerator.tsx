import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function TitleGenerator() {
  const [inputData, setInputData] = useState("");
  const [results, setResults] = useState<string[][]>([]);

  const generateTitles = () => {
    const lines = inputData
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const output: string[][] = [];

    for (const line of lines) {
      const parts = line.split(/\t|\s{2,}/);
      if (parts.length < 2) continue;
      const keywords = Array.from(
        new Set(parts[0].split(/[，,\s]+/).filter(Boolean))
      );
      const baseTitle = parts[1].replace(/\s+/g, "");
      const baseChars = baseTitle.split("");

      const combos: string[] = [];
      for (let i = 0; i < Math.max(3, Math.min(7, keywords.length)); i++) {
        let current = keywords[i] || "";
        const others = keywords.filter((_, idx) => idx !== i);
        current += others.slice(0, 2).join("");
        for (const ch of baseChars) {
          if (!current.includes(ch) && current.length < 30) {
            current += ch;
          }
        }
        combos.push(current.slice(0, 30));
      }
      output.push(combos);
    }
    setResults(output);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">淘宝标题生成器（批量版）</h1>
      <p className="text-sm text-muted-foreground">
        每行格式：蓝海词（逗号分隔）+ Tab 或多个空格 + 上家标题
        <br />例如：阳台种菜神器,育苗盘,加厚箱    家用育苗神器塑料箱套装组合
      </p>

      <Card>
        <CardContent className="space-y-4 p-4">
          <Textarea
            placeholder="请输入多行数据，每行一组蓝海词和上家标题"
            rows={10}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          <Button onClick={generateTitles}>生成标题</Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold">生成结果：</h2>
          {results.map((titles, idx) => (
            <div key={idx} className="p-2 border rounded">
              <p className="text-sm text-muted-foreground">第 {idx + 1} 组标题：</p>
              <ul className="list-disc pl-6">
                {titles.map((title, i) => (
                  <li key={i} className="break-all">{title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}