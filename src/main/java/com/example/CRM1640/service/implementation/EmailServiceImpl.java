package com.example.CRM1640.service.implementation;

import com.example.CRM1640.entities.other.EncourageEvent;
import com.example.CRM1640.entities.other.IdeaEvent;
import com.example.CRM1640.service.interfaces.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private static final String BASE_URL = "http://localhost:3000";

    // ================= SEND REVIEW (QA MANAGER) =================
    @Override
    public void sendReviewEmail(IdeaEvent event) {

        String link = BASE_URL + "/qa-queue?reviewId=" + event.getIdeaId();
        String content = """
            <p><b>Title:</b> %s</p>
            <p><b>Author:</b> %s</p>
            <p>A new idea has been submitted and requires your review.</p>
        """.formatted(event.getTitle(), event.getAuthorName());

        String html = buildTemplate(
                "📌 New Idea Submitted",
                content,
                "Review Idea",
                link,
                "#4facfe"
        );

        send(event.getQaManagerEmail(), "New Idea Submitted", html);
    }

    // ================= APPROVED ================= thaiminhchau20061972@gmail.com
    @Override
    public void sendApprovedEmail(IdeaEvent event) {

        String link = BASE_URL + "/my-ideas/" + event.getIdeaId();

        String content = """
            <p>Your idea "<b>%s</b>" has been approved 🎉</p>
            <p>You can now view your published idea.</p>
        """.formatted(event.getTitle());

        String html = buildTemplate(
                "✅ Idea Approved",
                content,
                "View Idea",
                link,
                "#28a745"
        );

        send(event.getAuthorEmail(), "Idea Approved", html);
    }

    // ================= REJECTED =================
    @Override
    public void sendRejectedEmail(IdeaEvent event) {

        String link = BASE_URL + "/my-ideas/" + event.getIdeaId();

        String content = """
            <p>Your idea "<b>%s</b>" was rejected.</p>
            <p><b>Feedback from QA:</b></p>
            <div style="padding:10px;background:#fff3f3;border-radius:8px;color:#333;">
                %s
            </div>
        """.formatted(event.getTitle(), event.getFeedback());

        String html = buildTemplate(
                "❌ Idea Rejected",
                content,
                "View Feedback",
                link,
                "#dc3545"
        );

        send(event.getAuthorEmail(), "Idea Rejected", html);
    }

    @Override
    public void sendEncourageEmail(EncourageEvent event) {

        String html = buildTemplate(
                "🚀 Share Your Ideas!",
                """
                <p>Hello 👋</p>
                <p>%s</p>
                
                <p><b>Department:</b> %s</p>
                
                <p>Don't miss your chance to contribute ideas 💡</p>
                """.formatted(event.getMessage(), event.getDepartmentName()),
                "Submit Idea",
                "http://localhost:3000/ideas/create",
                "#6f42c1"
        );

        for (String email : event.getEmails()) {
            send(email, "🚀 Encourage Idea Submission", html);
        }
    }

    // ================= CORE SEND =================
    private void send(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Send mail failed", e);
        }
    }

    // ================= TEMPLATE UI (LIKE YOUR WEB) =================
    private String buildTemplate(
            String title,
            String content,
            String buttonText,
            String link,
            String buttonColor
    ) {
        return """
        <div style="
            margin:0;
            padding:0;
            background:linear-gradient(135deg,#6a11cb,#2575fc);
            font-family:Arial,sans-serif;
        ">
            
            <div style="max-width:600px;margin:40px auto;padding:20px;">
                
                <!-- CARD -->
                <div style="
                    background:rgba(255,255,255,0.15);
                    backdrop-filter:blur(12px);
                    border-radius:20px;
                    padding:30px;
                    color:white;
                    box-shadow:0 10px 40px rgba(0,0,0,0.3);
                    text-align:center;
                ">
                    
                    <!-- LOGO -->
                    <h1 style="margin-bottom:10px;font-size:28px;">
                        💡 UniIdeas
                    </h1>
                    <p style="opacity:0.85;margin-bottom:25px;">
                        University Idea Management System
                    </p>

                    <!-- TITLE -->
                    <h2 style="margin-bottom:20px;">%s</h2>

                    <!-- CONTENT -->
                    <div style="
                        text-align:left;
                        margin-bottom:25px;
                        line-height:1.6;
                    ">
                        %s
                    </div>

                    <!-- BUTTON -->
                    <a href="%s"
                       style="
                           display:inline-block;
                           padding:14px 28px;
                           background:%s;
                           color:white;
                           text-decoration:none;
                           border-radius:10px;
                           font-weight:bold;
                           box-shadow:0 4px 15px rgba(0,0,0,0.2);
                       ">
                       %s
                    </a>

                    <!-- FOOTER -->
                    <p style="
                        margin-top:30px;
                        font-size:12px;
                        opacity:0.7;
                    ">
                        © 2026 Greenwich University - UniIdeas
                    </p>

                </div>
            </div>
        </div>
        """.formatted(title, content, link, buttonColor, buttonText);
    }
}