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
                                             {DOLLAR, "dollar"},
                                             {QUARTER, "quarter"},
                                             {DIME, "dime"},
                                             {NICKEL, "nickel"},
                                             {PENNY, "penny"}
                                         })
                                        .Named("EnglishUnitNames"));
            // TODO: create dictionary of plurals to pass to ChangeGenerator

            Container.Register(Component.For<IChangeGenerator>()
                                        .ImplementedBy<LeastAmountOfChangeGenerator>()
                                        .Named(nameof(LeastAmountOfChangeGenerator))
                                        .LifestyleTransient());

            Container.Register(Component.For<IChangeGenerator>()
                                        .ImplementedBy<RandomChangeGenerator>()
                                        .Named(nameof(RandomChangeGenerator))
                                        .LifestyleTransient());
        }

        public static IChangeGenerator LeastAmountOfChangeGenerator =>
            Container.Resolve<IChangeGenerator>(nameof(LeastAmountOfChangeGenerator));

        public static IChangeGenerator RandomChangeGenerator =>
            Container.Resolve<IChangeGenerator>(nameof(RandomChangeGenerator));
    }
}
