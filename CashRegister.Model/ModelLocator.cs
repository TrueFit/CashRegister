using System;
using System.Collections.Generic;
using System.Text;
using CashRegister.Model.Implementation;
using CashRegister.Model.Interfaces;
using Castle.MicroKernel.Registration;
using Castle.Windsor;

namespace CashRegister.Model
{
    public class ModelLocator
    {
        private static readonly WindsorContainer Container;

        static ModelLocator()
        {
            const double DOLLAR = 1.0;
            const double QUARTER = 0.25;
            const double DIME = 0.10;
            const double NICKEL = 0.05;
            const double PENNY = 0.01;

            const string DOLLAR_NAME = "dollar";
            const string QUARTER_NAME = "quarter";
            const string DIME_NAME = "dime";
            const string NICKEL_NAME = "nickel";
            const string PENNY_NAME = "penny";

            Container = new WindsorContainer();

            Container.Register(Component.For<IDictionary<double, int>>()
                                        .Instance(new Dictionary<double, int>
                                         {
                                             {DOLLAR, 0},
                                             {QUARTER, 0},
                                             {DIME, 0},
                                             {NICKEL, 0},
                                             {PENNY, 0}
                                         })
                                        .Named("EnglishUnitValues"));

            Container.Register(Component.For<IDictionary<double, string>>()
                                        .Instance(new Dictionary<double, string>
                                         {
                                             {DOLLAR, DOLLAR_NAME},
                                             {QUARTER, QUARTER_NAME},
                                             {DIME, DIME_NAME},
                                             {NICKEL, NICKEL_NAME},
                                             {PENNY, PENNY_NAME}
                                         })
                                        .Named("EnglishUnitNames"));

            Container.Register(Component.For<IDictionary<string, string>>()
                                        .Instance(new Dictionary<string, string>
                                        {
                                            {DOLLAR_NAME, "dollars" },
                                            {QUARTER_NAME, "quarters" },
                                            {DIME_NAME, "dimes" },
                                            {NICKEL_NAME, "nickels" },
                                            {PENNY_NAME, "pennies" }
                                        })
                                        .Named("EnglishUnitNamePlurals"));

            Container.Register(Component.For<IChangeGenerator>()
                                        .ImplementedBy<LeastAmountOfChangeGenerator>()
                                        .Named(nameof(LeastAmountOfChangeGenerator))
                                        .LifestyleTransient());

            Container.Register(Component.For<IChangeGenerator>()
                                        .ImplementedBy<RandomChangeGenerator>()
                                        .Named(nameof(RandomChangeGenerator))
                                        .LifestyleTransient());

            Container.Register(Component.For<IChangeGeneratorFactory>()
                                        .ImplementedBy<ChangeGeneratorFactory>());

            Container.Register(Component.For<ISettings>()
                                        .ImplementedBy<SettingsForFactory>()
                                        .LifestyleTransient());

            Container.Register(Component.For<IChangeGenerationService>()
                                        .ImplementedBy<ChangeGenerationService>());
        }

        internal static IChangeGenerator LeastAmountOfChangeGenerator =>
            Container.Resolve<IChangeGenerator>(nameof(LeastAmountOfChangeGenerator));

        internal static IChangeGenerator RandomChangeGenerator =>
            Container.Resolve<IChangeGenerator>(nameof(RandomChangeGenerator));
        
        public static ISettings Settings => Container.Resolve<ISettings>();

        public static IChangeGenerationService ChangeGenerationService 
            => Container.Resolve<IChangeGenerationService>();
    }
}
