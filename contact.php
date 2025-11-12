<?php
// contact.php - simple mailer. Requires a server with PHP mail configured.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = strip_tags(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST['message'] ?? '');

    // Validation
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and provide a valid email.";
        exit;
    }

    // Email configuration
    $to = 'vukonamdanisi6@gmail.com';
    $subject = 'Portfolio Contact: Message from ' . $name;
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = [
        'From' => $email,
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8'
    ];

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "Thank you! Your message has been sent successfully. I'll get back to you soon.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message. Please try emailing me directly at vukonamdanisi6@gmail.com";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>