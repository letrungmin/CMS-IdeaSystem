package com.example.CRM1640.service.implementation;

import com.example.CRM1640.dto.response.AnalyticsOverviewResponse;
import com.example.CRM1640.dto.response.DepartmentIdeaResponse;
import com.example.CRM1640.dto.response.PrivacyResponse;
import com.example.CRM1640.entities.organization.AcademicYearEntity;
import com.example.CRM1640.repositories.authen.UserRepository;
import com.example.CRM1640.repositories.idea.IdeaRepository;
import com.example.CRM1640.repositories.organization.AcademicYearRepository;
import com.example.CRM1640.service.interfaces.AnalyticsService;
import com.itextpdf.kernel.colors.ColorConstants;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.apache.poi.xddf.usermodel.chart.*;
import org.apache.poi.xssf.usermodel.XSSFChart;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.ss.util.CellRangeAddress;

import com.itextpdf.layout.properties.UnitValue;
import java.io.PrintWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.itextpdf.kernel.colors.DeviceRgb;
import java.io.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;


// --- APACHE POI (Xử lý Excel) ---
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.FillPatternType;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;


@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {
    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    public AnalyticsOverviewResponse getOverview() {

        Long totalIdeas = ideaRepository.countAllIdeas();

        Long activeUsers = userRepository.countActiveUsers();

        Double avgReactions = ideaRepository.avgReactions();
        if (avgReactions == null) avgReactions = 0.0;

        Long daysLeft = 0L;

        AcademicYearEntity year = academicYearRepository.findActive()
                .orElse(null);

        if (year != null && year.getFinalClosureDate() != null) {
            daysLeft = ChronoUnit.DAYS.between(
                    LocalDateTime.now(),
                    year.getFinalClosureDate()
            );
        }

        return new AnalyticsOverviewResponse(
                totalIdeas,
                activeUsers,
                avgReactions,
                daysLeft
        );
    }

    @Override
    public List<DepartmentIdeaResponse> getIdeasByDepartment() {

        List<Object[]> data = ideaRepository.countIdeasByDepartment();

        Long total = ideaRepository.countAllIdeas();

        return data.stream().map(obj -> {
            String name = (String) obj[0];
            Long count = (Long) obj[1];

            double percent = total == 0 ? 0 : (count * 100.0 / total);

            return new DepartmentIdeaResponse(name, percent, count);
        }).toList();
    }

    @Override
    public PrivacyResponse getPrivacy() {

        List<Object[]> result = ideaRepository.countPrivacy();

        Object[] obj = result.get(0);

        Long publicCount = ((Number) obj[0]).longValue();
        Long anonymousCount = ((Number) obj[1]).longValue();

        Long total = publicCount + anonymousCount;

        double publicPercent = total == 0 ? 0 : publicCount * 100.0 / total;
        double anonymousPercent = total == 0 ? 0 : anonymousCount * 100.0 / total;

        return new PrivacyResponse(publicPercent, anonymousPercent);
    }



    @Override
    public void exportCsv(HttpServletResponse response) throws IOException {
        // 1. Cài đặt Header để trình duyệt hiểu đây là file CSV tải về
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=analytics.csv");

        // 2. Lấy toàn bộ dữ liệu từ 3 hàm
        AnalyticsOverviewResponse overview = getOverview();
        List<DepartmentIdeaResponse> departments = getIdeasByDepartment();
        PrivacyResponse privacy = getPrivacy();

        // 3. Sử dụng PrintWriter để ghi dữ liệu vào response
        try (PrintWriter writer = response.getWriter()) {
            // Thêm BOM (Byte Order Mark) để Excel mở file nhận diện đúng font Tiếng Việt (UTF-8)
            writer.write('\ufeff');

            // ================= PHẦN 1: OVERVIEW =================
            writer.println("--- OVERVIEW ---");
            writer.println("Metric,Value");
            writer.println("Total Ideas," + overview.totalIdeas());
            writer.println("Active Users," + overview.activeUsers());
            writer.println("Avg Reactions," + overview.avgReactions());
            writer.println("Days Left," + overview.daysLeft());

            // Thêm một dòng trống để phân cách các phần cho dễ nhìn
            writer.println();

            // ================= PHẦN 2: DEPARTMENTS =================
            writer.println("--- DEPARTMENTS ---");
            // Giả sử DepartmentIdeaResponse có getPercent() và getCount(), bạn điều chỉnh lại tên getter cho đúng
            writer.println("Department,Percentage (%),Total Ideas");
            for (DepartmentIdeaResponse d : departments) {
                // Đề phòng trường hợp tên Department có chứa dấu phẩy (,), ta cần bọc nó trong cặp dấu nháy kép ""
                String safeDeptName = d.department() != null ? d.department().replace("\"", "\"\"") : "";
                writer.println("\"" + safeDeptName + "\"," + d.percent() + "," + d.total());
            }

            writer.println();

            // ================= PHẦN 3: PRIVACY =================
            writer.println("--- PRIVACY ---");
            writer.println("Type,Percentage (%)");
            writer.println("Public," + privacy.publicPercent());
            writer.println("Anonymous," + privacy.anonymousPercent());
        }
    }

    @Override
    public void exportZip(HttpServletResponse response) throws IOException {
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=Enterprise_Analytics_Report.zip");

        // Lấy dữ liệu
        AnalyticsOverviewResponse overview = getOverview();
        List<DepartmentIdeaResponse> departments = getIdeasByDepartment();
        PrivacyResponse privacy = getPrivacy();

        try (ZipOutputStream zos = new ZipOutputStream(response.getOutputStream())) {

            // 1. Ghi Excel (Bao gồm Biểu đồ)
            zos.putNextEntry(new ZipEntry("Analytics_Dashboard.xlsx"));
            zos.write(generateEnterpriseExcel(overview, departments, privacy));
            zos.closeEntry();

            // 2. Ghi PDF (Báo cáo chuyên nghiệp)
            zos.putNextEntry(new ZipEntry("Analytics_Report.pdf"));
            zos.write(generateEnterprisePdf(overview, departments, privacy));
            zos.closeEntry();

            // 3. Ghi CSV (Raw Data)
            zos.putNextEntry(new ZipEntry("Raw_Data.csv"));
            zos.write(generateCsvBytes(overview, departments, privacy));
            zos.closeEntry();

            zos.finish();
        }
    }

    private byte[] generateEnterpriseExcel(AnalyticsOverviewResponse overview, List<DepartmentIdeaResponse> depts, PrivacyResponse privacy) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // --- STYLE ---
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true); font.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // --- SHEET 1: DEPARTMENTS & CHART ---
            XSSFSheet deptSheet = (XSSFSheet) workbook.createSheet("Departments Dashboard");
            Row headerRow = deptSheet.createRow(0);
            createCell(headerRow, 0, "Department", headerStyle);
            createCell(headerRow, 1, "Percentage (%)", headerStyle);
            createCell(headerRow, 2, "Total Ideas", headerStyle);

            int rowIdx = 1;
            for (DepartmentIdeaResponse d : depts) {
                Row row = deptSheet.createRow(rowIdx++);
                createCell(row, 0, d.department(), null);
                createCell(row, 1, d.percent(), null);
                createCell(row, 2, d.total(), null);
            }

            // Thêm Filter cho bảng
            deptSheet.setAutoFilter(new CellRangeAddress(0, depts.size(), 0, 2));
            deptSheet.autoSizeColumn(0); deptSheet.autoSizeColumn(1); deptSheet.autoSizeColumn(2);

            // 📊 VẼ BIỂU ĐỒ CỘT (BAR CHART) CHO EXCEL
            if (!depts.isEmpty()) {
                XSSFDrawing drawing = deptSheet.createDrawingPatriarch();
                // Đặt vị trí biểu đồ (Cột E đến K, Dòng 1 đến 15)
                XSSFClientAnchor anchor = drawing.createAnchor(0, 0, 0, 0, 4, 1, 10, 16);
                XSSFChart chart = drawing.createChart(anchor);
                chart.setTitleText("Ideas Contribution by Department");
                chart.setTitleOverlay(false);

                XDDFCategoryAxis bottomAxis = chart.createCategoryAxis(AxisPosition.BOTTOM);
                XDDFValueAxis leftAxis = chart.createValueAxis(AxisPosition.LEFT);
                leftAxis.setCrosses(AxisCrosses.AUTO_ZERO);

                // Lấy dữ liệu từ bảng vừa tạo (Cột A làm Tên, Cột C làm Giá trị)
                XDDFDataSource<String> categories = XDDFDataSourcesFactory.fromStringCellRange(deptSheet, new CellRangeAddress(1, depts.size(), 0, 0));
                XDDFNumericalDataSource<Double> values = XDDFDataSourcesFactory.fromNumericCellRange(deptSheet, new CellRangeAddress(1, depts.size(), 2, 2));

                XDDFBarChartData data = (XDDFBarChartData) chart.createData(ChartTypes.BAR, bottomAxis, leftAxis);
                data.setBarDirection(BarDirection.COL);
                data.addSeries(categories, values).setTitle("Total Ideas", null);
                chart.plot(data);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private byte[] generateEnterprisePdf(AnalyticsOverviewResponse o, List<DepartmentIdeaResponse> depts, PrivacyResponse p) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        DeviceRgb primaryColor = new DeviceRgb(37, 99, 235); // Blue
        DeviceRgb rowEvenColor = new DeviceRgb(243, 244, 246); // Light Gray cho Zebra stripe

        // 1. TITLE
        document.add(new Paragraph("ENTERPRISE ANALYTICS REPORT")
                .setFontSize(22).setBold().setFontColor(primaryColor).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Generated on: " + java.time.LocalDate.now() + "\n\n").setTextAlignment(TextAlignment.RIGHT));

        // 2. OVERVIEW TABLE
        document.add(new Paragraph("1. System Overview").setBold().setFontSize(14));
        Table oTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
        addHeader(oTable, "Metric"); addHeader(oTable, "Value");
        oTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Total Ideas")).setPadding(5));
        oTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(String.valueOf(o.totalIdeas()))).setPadding(5));
        oTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph("Active Users")).setBackgroundColor(rowEvenColor).setPadding(5));
        oTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(String.valueOf(o.activeUsers()))).setBackgroundColor(rowEvenColor).setPadding(5));
        document.add(oTable);
        document.add(new Paragraph("\n"));

        // 3. DEPARTMENT TABLE (Dòng chẵn lẻ khác màu)
        document.add(new Paragraph("2. Department Breakdown").setBold().setFontSize(14));
        Table dTable = new Table(UnitValue.createPercentArray(new float[]{40, 30, 30})).useAllAvailableWidth();
        addHeader(dTable, "Department"); addHeader(dTable, "Total Ideas"); addHeader(dTable, "Percentage");

        int rowCount = 0;
        for (DepartmentIdeaResponse dept : depts) {
            DeviceRgb bgColor = (rowCount % 2 == 0) ? new DeviceRgb(255,255,255) : rowEvenColor;
            dTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(dept.department())).setBackgroundColor(bgColor).setPadding(5));
            dTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(String.valueOf(dept.total()))).setBackgroundColor(bgColor).setPadding(5));
            dTable.addCell(new com.itextpdf.layout.element.Cell().add(new Paragraph(String.format("%.1f%%", dept.percent()))).setBackgroundColor(bgColor).setPadding(5));
            rowCount++;
        }
        document.add(dTable);

        document.close();
        return baos.toByteArray();
    }

    private byte[] generateCsvBytes(AnalyticsOverviewResponse o, List<DepartmentIdeaResponse> depts, PrivacyResponse p) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // Tự động đóng PrintWriter khi xong
        try (PrintWriter writer = new PrintWriter(new java.io.OutputStreamWriter(baos, java.nio.charset.StandardCharsets.UTF_8))) {
            writer.write('\ufeff'); // BOM cho Excel
            writer.println("Report Generated," + java.time.LocalDateTime.now());
            writer.println("\n--- OVERVIEW ---");
            writer.println("Metric,Value");
            writer.println("Total Ideas," + o.totalIdeas());
            writer.println("\n--- DEPARTMENTS ---");
            writer.println("Department,Total Ideas,Percentage (%)");
            for (DepartmentIdeaResponse d : depts) {
                String safeName = d.department() != null ? d.department().replace("\"", "\"\"") : "";
                writer.println("\"" + safeName + "\"," + d.total() + "," + d.percent());
            }
        }
        return baos.toByteArray();
    }

    // =========================================================
    // HÀM HELPER CHO EXCEL
    // =========================================================
    private void createCell(Row row, int col, Object value, CellStyle style) {
        Cell cell = row.createCell(col);

        if (value instanceof Number number) {
            cell.setCellValue(number.doubleValue());
        } else {
            cell.setCellValue(value != null ? String.valueOf(value) : "");
        }

        if (style != null) {
            cell.setCellStyle(style);
        }
    }

    // =========================================================
    // HÀM HELPER CHO PDF
    // =========================================================
    private void addHeader(Table table, String text) {
        com.itextpdf.layout.element.Cell cell = new com.itextpdf.layout.element.Cell()
                .add(new Paragraph(text).setBold().setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(37, 99, 235))
                .setTextAlignment(TextAlignment.CENTER);

        table.addHeaderCell(cell);
    }
}
