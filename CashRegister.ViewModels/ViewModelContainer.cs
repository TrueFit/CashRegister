using System.ComponentModel;
using CashRegister.Model;
using CashRegister.Model.Implementation;
using CashRegister.Model.Interfaces;
using CashRegister.ViewModels.Implementation;
using CashRegister.ViewModels.Interfaces;
using Castle.Windsor;
using Component = Castle.MicroKernel.Registration.Component;

namespace CashRegister.ViewModels
{
    public class ViewModelContainer
    {
        private static readonly WindsorContainer Container;

        static ViewModelContainer()
        {
            Container = new WindsorContainer();

            Container.Register(Component.For<ISettingsViewModel>()
                                        .ImplementedBy<SettingsViewModel>());

            Container.Register(Component.For<IMainViewModel>()
                                        .ImplementedBy<MainViewModel>());

            Container.Register(Component.For<IFileAccess>()
                                        .ImplementedBy<FileAccess>());

            Container.Register(Component.For<ISettings>()
                                        .Instance(ModelLocator.Settings));

            Container.Register(Component.For<IChangeGenerationService>()
                                        .Instance(ModelLocator.ChangeGenerationService));
        }

        public static ISettingsViewModel SettingsViewModel
        {
            get => Container.Resolve<ISettingsViewModel>();
        }

        public static IMainViewModel MainViewModel
        {
            get => Container.Resolve<IMainViewModel>();
        }
    }
}
