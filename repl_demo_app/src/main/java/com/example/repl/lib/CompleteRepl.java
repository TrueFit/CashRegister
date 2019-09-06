package com.example.repl.lib;

import com.example.cash_register.shared.io.WriterWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;

import java.io.BufferedWriter;

/**
 * Implementation of {@link ReplBase} which wraps all the other REPL instances and loops over them.  Provides the {@code
 * `repl`} shell method to Spring shell.
 *
 * @see ShellComponent
 */
@ShellComponent
public class CompleteRepl extends ReplBase {
    /**
     * Calculator REPL
     *
     * @see CalculatorRepl
     */
    private final CalculatorRepl calculatorRepl;
    /**
     * Currency REPL
     *
     * @see CurrencyRepl
     */
    private final CurrencyRepl currencyRepl;
    /**
     * Input locale REPL
     *
     * @see InputLocaleRepl
     */
    private final InputLocaleRepl inputLocaleRepl;
    /**
     * Output locale REPL
     *
     * @see OutputLocaleRepl
     */
    private final OutputLocaleRepl outputLocaleRepl;
    /**
     * Output writer
     */
    private final BufferedWriter outputWriter;
    /**
     * Buffered writer wrapper
     *
     * @see WriterWrapper
     */
    private final WriterWrapper writerWrapper;
    /**
     * Owed REPL
     *
     * @see OwedRepl
     */
    private final OwedRepl owedRepl;
    /**
     * Workflow runner.
     *
     * @see ReplWorkflowRunner
     */
    private final ReplWorkflowRunner workflowRunner;
    /**
     * Tendered REPL
     *
     * @see TenderedRepl
     */
    private final TenderedRepl tenderedRepl;

    /**
     * Autowired constructor
     *
     * @param calculatorRepl Calculator REPL
     * @param currencyRepl Currency REPL
     * @param inputLocaleRepl Input locale REPL
     * @param outputLocaleRepl Output locale REPL
     * @param owedRepl Owed REPL
     * @param workflowRunner Workflow runner
     * @param tenderedRepl Tendered REPL
     */
    @Autowired
    protected CompleteRepl(
            CalculatorRepl calculatorRepl,
            CurrencyRepl currencyRepl,
            InputLocaleRepl inputLocaleRepl,
            OutputLocaleRepl outputLocaleRepl,
            BufferedWriter outputWriter,
            WriterWrapper writerWrapper,
            OwedRepl owedRepl,
            ReplWorkflowRunner workflowRunner,
            TenderedRepl tenderedRepl) {
        super();
        this.calculatorRepl = calculatorRepl;
        this.currencyRepl = currencyRepl;
        this.inputLocaleRepl = inputLocaleRepl;
        this.outputLocaleRepl = outputLocaleRepl;
        this.outputWriter = outputWriter;
        this.writerWrapper = writerWrapper;
        this.owedRepl = owedRepl;
        this.workflowRunner = workflowRunner;
        this.tenderedRepl = tenderedRepl;
    }

    /**
     * Implementation of {@link ReplBase#doReplImpl()} which loops over all the other REPL objects; also, provide the
     * Spring shell method which starts the REPL loop: {@code `repl`}
     *
     * @see ShellMethod
     */
    @Override
    @ShellMethod(key = "repl", value = "Starts the REPL loop")
    protected void doReplImpl() {
        this.writerWrapper.newLine(this.outputWriter);
        //noinspection InfiniteLoopStatement
        while (true) {
            this.currencyRepl.doRepl();
            this.inputLocaleRepl.doRepl();
            this.outputLocaleRepl.doRepl();
            this.owedRepl.doRepl();
            this.tenderedRepl.doRepl();
            this.calculatorRepl.doRepl();
            this.workflowRunner.runWorkflow();
        }
    }
}
