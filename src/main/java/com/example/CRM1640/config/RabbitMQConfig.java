package com.example.CRM1640.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class RabbitMQConfig {

    // ================= NORMAL =================
    public static final String EXCHANGE = "crm.exchange";
    public static final String QUEUE = "crm.notification.queue";
    public static final String ROUTING_KEY = "crm.notification";

    // ================= ENCOURAGE =================
    public static final String EXCHANGE_SEND_ENCOURAGE = "encourage.exchange";
    public static final String QUEUE_ENCOURAGE = "encourage.queue";
    public static final String ROUTING_KEY_ENCOURAGE = "encourage.routing";

    // ---------- NORMAL ----------
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue queue() {
        return new Queue(QUEUE);
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with(ROUTING_KEY);
    }

    // ---------- ENCOURAGE ----------
    @Bean
    public TopicExchange encourageExchange() {
        return new TopicExchange(EXCHANGE_SEND_ENCOURAGE);
    }

    @Bean
    public Queue encourageQueue() {
        return new Queue(QUEUE_ENCOURAGE);
    }

    @Bean
    public Binding encourageBinding() {
        return BindingBuilder
                .bind(encourageQueue())
                .to(encourageExchange())
                .with(ROUTING_KEY_ENCOURAGE);
    }

    // ---------- JSON ----------
    @Bean
    public MessageConverter messageConverter(ObjectMapper objectMapper) {
        return new JacksonJsonMessageConverter((JsonMapper) objectMapper);
    }
}