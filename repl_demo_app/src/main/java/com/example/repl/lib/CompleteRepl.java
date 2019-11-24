package com.example.repl.lib;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;

/**
 * Implementation of {@link ReplBase} which wraps all the other REPL instances and loops over them.  Provides the {@code
 * `repl`} shell method to Spring shell.
 *
 * @see ShellComponent
 */
@ShellComponent
public class CompleteRepl extends ReplBase {
    /**
     * See {@link CalculatorRepl}
     */
    private final CalculatorRepl calculatorRepl;
    /**
     * See {@link CurrencyRepl}
     */
    private final CurrencyRepl currencyRepl;
    /**
     * See {@link InputLocaleRepl}
     */
    private final InputLocaleRepl inputLocaleRepl;
    /**
     * See {@link OutputLocaleRepl}
     */
    private final OutputLocaleRepl outputLocaleRepl;
    /**
     * See {@link OwedRepl}
     */
    private final OwedRepl owedRepl;
    /**
     * See {@link TenderedRepl}
     */
    private final TenderedRepl tenderedRepl;
    /**
     * See {@link ReplWorkflowRunner}
     */
    private final ReplWorkflowRunner replWorkflowRunner;

    /**
     * Autowired constructor
     *
     * @param calculatorRepl See {@link CalculatorRepl}.
     * @param currencyRepl See {@link CurrencyRepl}.
     * @param inputLocaleRepl See {@link InputLocaleRepl}.
     * @param outputLocaleRepl See {@link OutputLocaleRepl}.
     * @param owedRepl See {@link OwedRepl}.
     * @param tenderedRepl See {@link TenderedRepl}.
     * @param replWorkflowRunner See {@link ReplWorkflowRunner}.
     */
    @Autowired
    protected CompleteRepl(
            final CalculatorRepl calculatorRepl,
            final CurrencyRepl currencyRepl,
            final InputLocaleRepl inputLocaleRepl,
            final OutputLocaleRepl outputLocaleRepl,
            final OwedRepl owedRepl,
            final TenderedRepl tenderedRepl,
            final ReplWorkflowRunner replWorkflowRunner) {
        super();
        this.calculatorRepl = calculatorRepl;
        this.currencyRepl = currencyRepl;
        this.inputLocaleRepl = inputLocaleRepl;
        this.outputLocaleRepl = outputLocaleRepl;
        this.owedRepl = owedRepl;
        this.tenderedRepl = tenderedRepl;
        this.replWorkflowRunner = replWorkflowRunner;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which loops over all the other REPL objects; also, provides the
     * Spring shell method which starts the REPL loop: {@code `repl`}
     *
     * @see ShellMethod
     */
    @Override
    @ShellMethod(key = "repl", value = "Starts the REPL loop")
    protected void doReplImpl() {
        this.newLine();
        //noinspection InfiniteLoopStatement
        while (true) {
            this.currencyRepl.doRepl();
            this.inputLocaleRepl.doRepl();
            this.outputLocaleRepl.doRepl();
            this.owedRepl.doRepl();
            this.tenderedRepl.doRepl();
            this.calculatorRepl.doRepl();
            this.replWorkflowRunner.runWorkflow();
        }
    }
}
