package com.example.tango.demo.application;

import com.example.tango.demo.lib.InnerTangoDemoRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Implements {@link ApplicationRunner} for this application.
 */
@Component(TangoDemoRunner.QUALIFIER)
class TangoDemoRunner implements ApplicationRunner {
    /**
     * Spring qualifier.
     */
    static final String QUALIFIER = "com.example.tango.demo.application.TangoDemoRunner";
    /**
     * See {@link InnerTangoDemoRunner}.
     */
    private final InnerTangoDemoRunner innerTangoDemoRunner;

    /**
     * Autowired constructor.
     *
     * @param innerTangoDemoRunner See {@link InnerTangoDemoRunner}.
     */
    @Autowired
    private TangoDemoRunner(InnerTangoDemoRunner innerTangoDemoRunner) {
        this.innerTangoDemoRunner = innerTangoDemoRunner;
    }

    /**
     * Runs the inner application runner.
     *
     * @param args Per {@link ApplicationRunner#run(ApplicationArguments)}.
     */
    @Override
    public void run(ApplicationArguments args) {
        this.innerTangoDemoRunner.runImpl(args);
    }
}
