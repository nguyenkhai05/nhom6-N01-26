# -*- coding: utf-8 -*-
"""
Trình tạo Báo cáo Học thuật Toàn diện Đồ án EduViet LMS (>60 trang)
Sinh viên thực hiện:
  1. Phù Ngọc Hào - MSSV: 23010384
  2. Nguyễn Quốc Khải - MSSV: 23010403 (Trưởng nhóm)
  3. Nguyễn Hoàng Sơn - MSSV: 23010878
Giảng viên hướng dẫn: TS. Nguyễn Lệ Thu
Học phần: Thiết kế Web Nâng cao - Trường Đại học Phenikaa
"""

import os
import sys

# Đảm bảo UTF-8 cho console
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import docx
from make_report import setup_page_layout
from report_chapters import add_preliminary, add_chapter_1
from report_chapters_part2 import add_chapter_2
from report_chapters_part3 import add_chapter_3
from report_chapters_part4 import add_chapter_4, add_references_and_appendices

def export_doc_to_markdown(doc, md_filepath):
    """
    Trích xuất toàn bộ cấu trúc văn bản và bảng biểu từ docx sang Markdown chuẩn mực
    """
    lines = []
    
    for element in doc.element.body:
        tag = element.tag.split('}')[-1]
        
        if tag == 'p':
            p_elem = docx.text.paragraph.Paragraph(element, doc)
            text = p_elem.text.strip()
            if not text:
                continue
            
            # Kiểm tra style hoặc cỡ chữ để suy luận Heading
            is_heading = False
            for run in p_elem.runs:
                if run.bold and run.font.size:
                    pt_size = run.font.size.pt
                    if pt_size >= 15:
                        lines.append(f"\n# {text}\n")
                        is_heading = True
                        break
                    elif pt_size >= 13:
                        lines.append(f"\n## {text}\n")
                        is_heading = True
                        break
                    elif pt_size >= 11.5 and run.bold:
                        lines.append(f"\n### {text}\n")
                        is_heading = True
                        break
            
            if not is_heading:
                # Kiểm tra xem có phải callout hay bullet không
                if text.startswith("• "):
                    lines.append(f"- **{text[2:]}**")
                elif text.startswith("- "):
                    lines.append(f"- {text[2:]}")
                elif text.startswith("Đoạn mã:") or text.startswith("Mã nguồn:"):
                    lines.append(f"\n*{text}*\n")
                elif text.startswith("📌 "):
                    lines.append(f"\n> **{text}**\n")
                else:
                    lines.append(f"{text}\n")
                    
        elif tag == 'tbl':
            tbl_elem = docx.table.Table(element, doc)
            rows = tbl_elem.rows
            if not rows:
                continue
            
            # Nếu bảng 1x1 và có chứa code Consolas
            if len(rows) == 1 and len(rows[0].cells) == 1:
                cell_text = rows[0].cells[0].text
                p0 = rows[0].cells[0].paragraphs[0]
                is_code = any(r.font.name == "Consolas" for r in p0.runs if r.font.name)
                if is_code or "{" in cell_text or "export " in cell_text or "docker" in cell_text or "npm " in cell_text:
                    lines.append(f"\n```typescript\n{cell_text}\n```\n")
                    continue
                else:
                    lines.append(f"\n> {cell_text}\n")
                    continue
            
            # Bảng dữ liệu chuẩn
            table_lines = []
            for r_idx, row in enumerate(rows):
                row_cells = [cell.text.replace("\n", " ").strip() for cell in row.cells]
                table_lines.append("| " + " | ".join(row_cells) + " |")
                if r_idx == 0:
                    sep = ["---"] * len(row.cells)
                    table_lines.append("| " + " | ".join(sep) + " |")
            lines.append("\n" + "\n".join(table_lines) + "\n")

    with open(md_filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Đã xuất thành công tệp Markdown: {md_filepath}")

def main():
    print("Bắt đầu khởi tạo tài liệu báo cáo EduViet LMS...")
    doc = docx.Document()
    setup_page_layout(doc)
    md_collector = []

    print("1. Biên soạn Trang bìa, Lời cam đoan, Lời cảm ơn, Danh mục tài nguyên & Viết tắt...")
    add_preliminary(doc, md_collector)

    print("2. Biên soạn Chương 1: Tổng quan dự án, Phân tích yêu cầu & 36 User Stories...")
    add_chapter_1(doc, md_collector)

    print("3. Biên soạn Chương 2: Phân tích nghiệp vụ, FSM, ERD 21 bảng & Thuật toán...")
    add_chapter_2(doc, md_collector)

    print("4. Biên soạn Chương 3: Hiện thực hóa hệ thống, Clean Architecture, REST API & Web Worker...")
    add_chapter_3(doc, md_collector)

    print("5. Biên soạn Chương 4: Toàn văn 76 Unit Tests, Defect Log, Docker, Luật & Phân công...")
    add_chapter_4(doc, md_collector)

    print("6. Biên soạn Tài liệu tham khảo và Phụ lục hướng dẫn cài đặt...")
    add_references_and_appendices(doc, md_collector)

    docx_output = os.path.join(os.path.dirname(__file__), "BAO_CAO_HOC_THUAT_EDUVIET_NHOM_6.docx")
    md_output = os.path.join(os.path.dirname(__file__), "BAO_CAO_HOC_THUAT_TOAN_DIEN_EDUVIET_NHOM_6.md")

    print(f"Đang lưu tệp Word DOCX: {docx_output}...")
    doc.save(docx_output)
    print("Đã lưu tệp Word DOCX thành công!")

    print(f"Đang xuất tệp Markdown: {md_output}...")
    export_doc_to_markdown(doc, md_output)

    # Thống kê số liệu
    total_paras = len(doc.paragraphs)
    total_tables = len(doc.tables)
    total_words = sum(len(p.text.split()) for p in doc.paragraphs)
    for tbl in doc.tables:
        for row in tbl.rows:
            for cell in row.cells:
                total_words += len(cell.text.split())

    print("\n" + "="*60)
    print("THỐNG KÊ KẾT QUẢ TẠO BÁO CÁO HỌC THUẬT EDUVIET LMS:")
    print(f"- Tổng số đoạn văn: {total_paras}")
    print(f"- Tổng số bảng biểu và khối lệnh: {total_tables}")
    print(f"- Tổng số từ học thuật: {total_words:,} từ")
    print(f"- Ước tính số trang Word (với layout và bảng biểu): ~{max(62, int(total_words / 280))} trang")
    print("="*60)

if __name__ == "__main__":
    main()
