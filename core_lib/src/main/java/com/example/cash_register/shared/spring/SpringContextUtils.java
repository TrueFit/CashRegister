package com.example.cash_register.shared.spring;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Helper utility which assists with accessing a Spring context from non-managed locations.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Component(SpringContextUtils.QUALIFIER)
public final class SpringContextUtils implements ApplicationContextAware {
    /**
     * Spring qualifier.
     */
    public static final String QUALIFIER = "com.example.cash_register.shared.spring.SpringContextUtils";

    /**
     * The Spring application context.
     */
    private static ApplicationContext context;

    /**
     * Gets a bean from the Spring context given the name and required type.
     *
     * @param name Per {@link ApplicationContext#getBean(String, Class)}.
     * @param requiredType Per {@link ApplicationContext#getBean(String, Class)}.
     * @param <T> The required type.
     *
     * @return Per {@link ApplicationContext#getBean(String, Class)}.
     */
    public static <T> T getBean(final String name, final Class<T> requiredType) {
        return SpringContextUtils.context.getBean(name, requiredType);
    }

    /**
     * Gets a bean from the Spring context given the required type.
     *
     * @param requiredType Per {@link ApplicationContext#getBean(String, Class)}.
     * @param <T> The required type.
     *
     * @return Per {@link ApplicationContext#getBean(String, Class)}.
     */
    public static <T> T getBean(final Class<T> requiredType) {
        return SpringContextUtils.context.getBean(requiredType);
    }

    /**
     * Implementation of {@link ApplicationContextAware#setApplicationContext(ApplicationContext)}. Sets {@link
     * #context} to the provided application context.
     *
     * @param context The application context.
     *
     * @throws BeansException Per {@link ApplicationContextAware#setApplicationContext(ApplicationContext)}.
     */
    @SuppressWarnings("NullableProblems")
    @Override
    @Autowired
    public void setApplicationContext(final ApplicationContext context) throws BeansException {
        SpringContextUtils.context = context;
    }
}
